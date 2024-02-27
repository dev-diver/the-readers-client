import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useRecoilState } from "recoil";
import { bookState, roomUserState, roomUsersState, currentPageState } from "recoil/atom";
import socket from "socket";
import { useImmer } from "use-immer";
import { produce } from "immer";

import api from "api";
// 미리 정의된 색상 배열
function Chart() {
	// 유저 관련 상태
	const { roomId, bookId } = useParams();
	const [prevRoomUsers, setPrevRoomUsers] = useState([]);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	// 페이지 관련 상태
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const [book, setBook] = useRecoilState(bookState);
	const [prevPage, setPrevPage] = useState(0);
	const [currentUsersPage, setCurrentUsersPage] = useImmer([]);
	const [bookChanged, setBookChanged] = useState(false);
	// 차트 데이터 관련 상태
	const [data, setData] = useImmer([]);
	const [count, setCount] = useState(0);
	const [chartId, setChartId] = useState(0);

	const insertUserData = (user, userData) => {
		const pages = userData;
		setData((currentData) =>
			produce(currentData, (draft) => {
				pages.forEach((page) => {
					const index = draft.findIndex((item) => item.page == page.pageNumber);
					if (index !== -1) {
						draft[index][user.id] = page.readTime;
					} else {
						draft.push({ page: page.pageNumber, [user.id]: page.readTime });
					}
				});
			})
		);
	};

	useEffect(() => {
		console.log("book changed");
		setBookChanged((prev) => !prev);
		return () => {
			setData([]);
		};
	}, [roomUser, book]);

	//1,2 유저가 들어올 때 내꺼만 server에 load하기 (find 또는 create)
	useEffect(() => {
		const findOrCreateChart = () => {
			console.info("findOrCreateChart", roomUser, book);
			if (!roomUser?.user?.id || !book) return;
			api
				.get(`/chart/book/${bookId}/user/${roomUser?.user?.id}`)
				.then((response) => {
					console.log(response.data.pages);
					// chartId를 받아옴
					setChartId(response.data.chartId);
					insertUserData(roomUser?.user, response.data.pages);
				})
				.catch((error) => {
					console.log("error", error);
				});
		};
		findOrCreateChart();
	}, [roomUser, bookChanged]);

	//5.room users 바뀜
	useEffect(() => {
		const bookId = book?.id;
		if (data.length === 0) {
			roomUsers.forEach((rUser) => {
				if (rUser.id == roomUser?.user?.id) return;
				api.get(`/chart/book/${bookId}/user/${rUser.id}`).then((response) => {
					console.log("response", response.data.pages);
					insertUserData(rUser, response.data.pages);
				});
			});
		} else {
			const goneUsers = prevRoomUsers.filter((prevUser) => !roomUsers.some((user) => user.id === prevUser.id));
			const joinedUsers = roomUsers.filter((user) => !prevRoomUsers.some((prevUser) => prevUser.id === user.id));
			setPrevRoomUsers(roomUsers);
			joinedUsers.forEach((user) => {
				api.get(`/chart/book/${bookId}/user/${user.id}`).then((response) => {
					insertUserData(user, response.data.pages);
				});
			});
			goneUsers.forEach((user) => {
				setData((currentData) =>
					produce(currentData, (draft) => {
						draft.forEach((page) => {
							delete page[user.id];
						});
					})
				);
			});
		}
	}, [roomUsers, bookChanged]);

	// 4-1. 토끼 거북. 페이지 바뀜 socket post
	useEffect(() => {
		const roomUserId = roomUser?.user?.id;
		if (!book || !roomUserId || chartId == 0) return;
		const index = data.findIndex((item) => item.page == prevPage);
		if (index !== -1) {
			const updatedTime = data[index][roomUserId] || 0;
			api
				.put(`/chart/${chartId}`, {
					chartId: chartId,
					currentPage: currentPage,
					time: updatedTime,
				})
				.then((response) => {
					console.log("***서버에 save한 response", response);
				})
				.catch((error) => {
					console.log("error", error);
				});
		} else {
			// * 해당 페이지가 없는 경우 무시하시오.
			console.log("바꿀 페이지 없음");
		}
		socket.emit("current-user-position", {
			currentPage: currentPage,
			user: roomUser.user,
			bookKey: book.id,
			roomKey: roomUser.roomId,
		});
	}, [currentPage, chartId, roomUser, book]);

	//3-1. 차트 부분 업데이트 (초 카운트)
	useEffect(() => {
		const roomUserId = roomUser?.user?.id;
		if (!roomUser?.user) return;
		// 1초마다 count 증가
		const interval = setInterval(() => {
			setData((prevData) =>
				produce(prevData, (draft) => {
					let pageDataIndex = draft.findIndex((item) => item.page == currentPage);
					if (pageDataIndex !== -1) {
						draft[pageDataIndex][roomUserId] = (draft[pageDataIndex][roomUserId] || 0) + 1;
					} else {
						let newPageData = { page: currentPage, [roomUserId]: 1 };
						draft.push(newPageData);
					}
				})
			);
			const userKey = roomUserId;
			const pageKey = currentPage;
			const bookKey = book.id;
			const updatedTime = data.find((item) => item.page == pageKey)?.[userKey] || 0;
			socket.emit("send-chart", { updatedTime, userKey, pageKey, bookKey });
		}, 1000);

		// 컴포넌트가 언마운트될 때 인터벌 정리
		return () => {
			clearInterval(interval);
			setPrevPage(currentPage);
		};
	}, [roomUser, currentPage, book]);

	//4-2. 토끼 거북 other user position get
	useEffect(() => {
		socket.on("other-user-position", (data) => {
			const { currentPage, user, bookKey, roomKey } = data;

			if (roomKey !== roomId || bookKey !== book.id) {
				setCurrentUsersPage((draft) => {
					const userIndex = draft.findIndex((u) => u.id === user.id);
					if (userIndex > -1) {
						draft.splice(userIndex, 1);
					}
				});
			} else {
				setCurrentUsersPage((draft) => {
					const userIndex = draft.findIndex((u) => u.id === user.id);
					if (userIndex > -1) {
						draft[userIndex].currentPage = currentPage;
					} else {
						draft.push({ id: user.id, currentPage: currentPage, profileImg: user.profileImg });
					}
				});
			}
		});

		return () => {
			socket.off("other-user-position");
		};
	}, [roomId, book]);

	//3-2. 차트 부분 업데이트 get
	useEffect(() => {
		const handleUpdateChart = (data) => {
			const { updatedTime, userKey, pageKey, bookKey } = data;
			if (bookKey != bookId) return;
			setData((prevData) =>
				produce(prevData, (draft) => {
					let pageDataIndex = draft.findIndex((item) => item.page == pageKey);
					if (pageDataIndex !== -1) {
						draft[pageDataIndex][userKey] = updatedTime;
					} else {
						let newPageData = { page: pageKey, [userKey]: updatedTime };
						draft.push(newPageData);
					}
				})
			);
		};
		socket.on("update-chart", handleUpdateChart);
		return () => {
			socket.off("update-chart", handleUpdateChart);
		};
	}, [bookId, setData]);

	const CustomTick = React.memo(
		({ x, y, payload, book, currentUsersPage, roomUsers }) => {
			// 페이지 활성화 상태를 나타내는 배열 생성, 초기값은 모두 0 (비활성화)
			let isActiveArray = new Array(book?.totalPage || 0).fill(0);

			// 현재 페이지에 해당하는 사용자들을 필터링
			const usersOnPage = currentUsersPage.filter((user) => Number(user.currentPage) === Number(payload.value));
			// 본인의 프로필을 배열의 첫 번째 요소로, 다른 사용자들은 그 뒤로 정렬
			const sortedUsersOnPage = usersOnPage.sort((a, b) => (b.id === roomUser?.user.id ? -1 : 1));
			// currentUsers를 순회하면서, 각 사용자의 페이지를 확인
			sortedUsersOnPage.forEach((user) => {
				if (Number(user.currentPage) === Number(payload.value)) {
					// 해당 사용자의 페이지가 현재 payload.value와 일치하면, 활성화 상태를 1로 설정 (바, 색상)
					isActiveArray[Number(payload.value) - 1] = 1;
				}
			});

			// 현재 tick이 활성화된 페이지인지 확인
			const isActive = isActiveArray[Number(payload.value) - 1] === 1;

			// 활성화 상태에 따른 스타일 설정
			const style = {
				// fill: isActive ? "red" : "black", // 현재 페이지에 있는 유저는 빨간색으로 표시
				fontSize: isActive ? "16px" : "14px", // 현재 페이지에 있는 유저는 폰트 크기를 크게
				fontWeight: isActive ? 600 : 400, // 현재 페이지에 있는 유저는 폰트 굵기를 크게
			};

			return (
				<Link to={`/room/${roomId}/book/${bookId}?page=${payload.value}`}>
					<g transform={`translate(${x},${y})`}>
						{/* 텍스트 레이블을 계속 표시 */}
						<text x={0} y={0} dy={16} textAnchor="end" fontSize={style.fontSize} fontWeight={style.fontWeight}>
							{payload.value}
						</text>
						{/* foreignObject를 사용하여 이미지를 표시 */}
						{sortedUsersOnPage.map((user, index, arr) => (
							// 본인은 가장 앞에, 나머지 사용자들이 생기면 본인을 x축 점점 앞으로 배치
							<foreignObject key={user.id} x={-60 + 10 * index} y={-6} width="40" height="40">
								<img
									src={user.profileImg}
									width="32"
									height="32"
									style={{
										borderRadius: "50%",
										border: `2px solid ${user.color}`,
										borderShadow: `0 0 0 3px ${user.color}`,
										filter: index === arr.length - 1 ? "none" : "grayscale(50%)", // 마지막 사용자(본인)는 필터 없음, 나머지는 그레이스케일
									}}
									alt={`User ${user.id}`}
								/>
							</foreignObject>
						))}
					</g>
				</Link>
			);
		}
		// (prevProps, nextProps) => {
		// 	// prop 비교 로직을 추가하여 실제로 필요한 경우에만 리렌더링 되도록 함
		// 	return (
		// 		prevProps.payload.value === nextProps.payload.value &&
		// 		prevProps.x === nextProps.x &&
		// 		prevProps.y === nextProps.y &&
		// 		prevProps.book === nextProps.book &&
		// 		prevProps.currentUsersPage === nextProps.currentUsersPage &&
		// 		prevProps.roomUsers === nextProps.roomUsers
		// 	);
		// }
	);

	CustomTick.displayName = "CustomTick";

	return (
		// width="25%" height={650} style={{ position: "sticky", top: "20px" }}
		<div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
			{roomUser?.user?.id && (
				<ResponsiveContainer>
					<AreaChart
						layout="vertical"
						width={400}
						height={800}
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<XAxis type="number" />
						<YAxis
							dataKey="page"
							type="category"
							interval={0}
							tick={<CustomTick currentUsersPage={currentUsersPage} book={book} roomUsers={roomUsers} />}
						/>
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip cursor={{ stroke: roomUser?.user.color || "black", strokeWidth: 2 }} />
						{roomUser?.user?.id &&
							[
								...roomUsers.filter((user) => user.id !== roomUser.user.id),
								...roomUsers.filter((user) => user.id === roomUser.user.id),
							]?.map((user, index) => (
								<Area
									key={user.id}
									type="monotone"
									dataKey={user.id}
									stroke={user.color} // 사용자별 고유 색상으로 stroke 설정
									fillOpacity={0.8}
									fill={user.color} // 사용자별 고유 색상으로 fill 설정
								/>
							))}
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}

export default Chart;
