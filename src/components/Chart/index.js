import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useRecoilState } from "recoil";
import { bookState, roomUserState, roomUsersState, currentPageState } from "recoil/atom";
import socket from "socket";
import { Button } from "@mui/material";
import { useImmer } from "use-immer";
import { produce } from "immer";

import api from "api";
import { useNavigate } from "react-router-dom";

// 미리 정의된 색상 배열
function coloringUser(userId) {
	const colors = ["#8884d8", "#82ca9d", "#E69F00", "#ff4b73", "#56B4E9"];

	return colors[(Number(userId) - 1) % colors.length];
}

function Chart() {
	// 유저 관련 상태
	const { roomId, bookId } = useParams();
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	// 페이지 관련 상태
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const [book, setBook] = useState(bookState);
	const [prevPage, setPrevPage] = useState(0);
	const [currentUsersPage, setCurrentUsersPage] = useImmer([]);
	const navigate = useNavigate();
	// 차트 데이터 관련 상태
	const [data, setData] = useImmer([]);
	const [count, setCount] = useState(0);
	const [chartId, setChartId] = useState(0);

	// 디버깅용 출력
	// useEffect(() => {
	// 	console.log("roomUsers", roomUsers);
	// 	console.log("roomUser", roomUser);
	// }, []);
	// useEffect(() => {
	// 	console.log("TEST");
	// 	console.log("data", data);
	// }, [data]);

	/*** Server 수정중 (save, load) ***/
	// 유저가 들어올 때 server에 load하기 (find 또는 create)
	// 유저가 나갈 때 server에 save하기 (update)
	useEffect(() => {
		const findOrCreateChart = () => {
			if (!roomUser?.user?.id) return;
			api
				.get(`/chart/book/${bookId}/user/${roomUser?.user?.id}`)
				.then((response) => {
					console.warn("***서버에서 온 response", response);
					// chartId를 받아옴
					setChartId(response.data.chartId);
					// pages를 받아와서 data에 page와 해당 user의 readTime을 immer로 업데이트
					const pages = response.data.pages;

					// immer를 사용하여 data 상태 업데이트
					setData((currentData) =>
						produce(currentData, (draft) => {
							// pages 배열을 반복하여 각 페이지에 대한 정보 업데이트
							pages.forEach((page) => {
								const index = draft.findIndex((item) => item.page == page.pageNumber);
								if (index !== -1) {
									// 해당 페이지 정보가 이미 있으면 readTime 업데이트
									draft[index][roomUser.user.id] = page.readTime;
								} else {
									// 새 페이지 정보 추가
									draft.push({ page: page.pageNumber, [roomUser.user.id]: page.readTime });
								}
							});
						})
					);
				})
				.catch((error) => {
					console.log("error", error);
				});
		};
		console.log("server****");
		socket.on("room-users-changed", findOrCreateChart);

		return () => {
			socket.off("room-users-changed", findOrCreateChart);
		};
	}, [roomUser, bookId]);
	/*********************************/
	useEffect(() => {
		if (!book) {
			return;
		}
		/************ Client 로직 수정 중 
		// 처음 페이지 로딩 시, 총 페이지와 함께 방에 있는 사용자들의 시간 정보를 초기화
		const initializeChart = () => {
			return new Array(totalPage).fill(null).map((_, index) => {
				const pageObject = { page: `${index + 1}` }; // 기본 page 설정
				roomUsers.forEach((user) => {
					const userIdKey = user?.id; // 각 사용자 ID에 대한 키 생성
					pageObject[userIdKey] = 0; // 해당 사용자 ID 키를 객체에 추가하고 0으로 초기화
				});
				return pageObject;
			});
		}

		const drawChartForNewUser

		const removeChartForExitedUser
		*********************************/

		// 페이지 데이터를 초기화하는 함수
		const initializePageData = () => {
			return new Array(book?.totalPage || 0).fill(null).map((_, index) => {
				const pageObject = { page: `${index + 1}` }; // 기본 page 설정
				roomUsers?.forEach((user) => {
					const userIdKey = user?.id; // 각 사용자 ID에 대한 키 생성
					pageObject[userIdKey] = 0; // 해당 사용자 ID 키를 객체에 추가하고 0으로 초기화
				});
				return pageObject;
			});
		};

		// 기존 데이터를 업데이트하는 함수
		const updatePageDataWithNewUsers = (existingData) => {
			// const currentRoomUserIds = new Set(roomUsers.map((user) => user.id)); // 현재 roomUsers의 모든 id를 Set으로 생성합니다.
			return existingData?.map((pageObject) => {
				const updatedPageObject = { ...pageObject }; // 기존 페이지 객체 복사

				// roomUsers에 없는 사용자의 데이터를 제거합니다.
				// Object.keys(updatedPageObject).forEach((key) => {
				// 	if (key !== "page" && !currentRoomUserIds.has(key)) {
				// 		delete updatedPageObject[key];
				// 	}
				// });

				// roomUsers에 있는 사용자의 데이터를 업데이트하거나 추가합니다.
				roomUsers?.forEach((user) => {
					const userIdKey = user?.id; // 각 사용자 ID에 대한 키
					// 해당 사용자 ID 키가 없는(새로운 유저일 경우) 0으로 초기화
					if (!Object.hasOwnProperty.call(updatedPageObject, userIdKey)) {
						updatedPageObject[userIdKey] = 0;
					}
				});
				return updatedPageObject;
			});
		};

		// 데이터가 이미 있으면 업데이트하고, 없으면 초기화
		const updatedOrInitializedData = data?.length === 0 ? initializePageData() : updatePageDataWithNewUsers(data);

		setData(updatedOrInitializedData); // 업데이트된 또는 초기화된 데이터로 상태
	}, [roomUsers, book]); // roomUsers가 변경될 때마다 이 로직을 다시 실행

	useEffect(() => {
		const handleUpdateChart = (userData) => {
			const { filteredData, userKey } = userData;

			setData((prevData) => {
				return prevData.forEach((item) => {
					// filteredData에서 현재 순회 중인 page와 일치하는 항목을 찾습니다.
					const filteredItem = filteredData.find((data) => data.page === item.page);

					// 일치하는 항목이 있는 경우, 해당 userKey의 값을 업데이트합니다.
					if (filteredItem) {
						// 'userKey'를 업데이트하고 나머지 항목은 그대로 유지합니다.
						item[userKey] = filteredItem[userKey] ?? item[userKey];
					}
				});
			});
		};

		socket.on("update-chart", handleUpdateChart);

		return () => {
			socket.off("update-chart", handleUpdateChart);
		};
	}, []);

	useEffect(() => {
		setPrevPage(currentPage);
		// 1초마다 count 증가
		const interval = setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);
		// console.log("data", data);

		// 컴포넌트가 언마운트될 때 인터벌 정리
		return () => clearInterval(interval);
	}, [currentPage]);

	// count는 스크롤 이벤트가 한 번 발생한 이후부터 시작. 그 전엔 카운트 안 셈.
	// data에서 prevScroll에 해당하는 값이 time 키와 같을 때 그 값을 1초에 1씩 증가시킴
	// count가 prevScroll 값이 바뀔 때마다 0으로 초기화되는 기능 포함
	useEffect(() => {
		// data가 {}일 때는 !data로 잡히지 않으므로 추가로 조건문을 걸어줌
		if (!roomUser || !data || Object.keys(data).length === 0) return;
		const userKey = roomUser?.user?.id;

		const updatedData = data.map((item) => {
			if (Number(item.page) === prevPage) {
				// data의 parseInt(item.page)과 같은 값의 page를 찾아 time을 count만큼 증가시킴
				const count_tmp = count;
				setCount(0);
				// 사용자 ID에 해당하는 키의 값을 업데이트하거나 초기화
				const newItem = {
					...item,
					[userKey]: item[userKey] + count_tmp,
				};

				return newItem;
			}
			return item;
		});

		setData(updatedData);

		// socket
		// const time = updatedData[page][userKey];
		const filterDataByUserId = (updatedData, userKey) => {
			return updatedData
				.map((item) => {
					// userId가 주어진 값과 일치하는 경우 해당 값으로 새 객체를 생성하고, 그렇지 않은 경우 undefined를 반환
					const value = item[userKey];
					if (value !== undefined) {
						return { [userKey]: value, page: item.page };
					}
					return null; // userId가 2인 항목이 없는 경우 null 반환
				})
				.filter((item) => item !== null); // null 값을 제거하여 최종 배열 생성
		};

		const filteredData = filterDataByUserId(updatedData, userKey);
		// console.log("*****send data from client to server*****");
		// console.log("filteredData", filteredData);
		const room = roomUser.roomId;
		socket.emit("send-chart", { filteredData, userKey, room });
	}, [currentPage, roomUsers]);

	// Hare And Tortoise
	useEffect(() => {
		if (!roomUser?.user) return;
		socket.emit("current-user-position", { currentPage: currentPage, user: roomUser.user, room: roomUser.roomId });
	}, [roomUser, currentPage]);

	useEffect(() => {
		socket.on("other-user-position", (data) => {
			const { user, currentPage } = data;

			setCurrentUsersPage((draft) => {
				const userIndex = draft.findIndex((u) => u.id === user.id);

				if (userIndex > -1) {
					// 사용자가 이미 존재하면, 해당 사용자의 정보를 직접 업데이트합니다.
					draft[userIndex].currentPage = currentPage;
					draft[userIndex].profileImg = user.profileImg;
				} else {
					// 새 사용자라면, 배열에 직접 추가합니다.
					draft.push({ id: user.id, currentPage: currentPage, profileImg: user.profileImg });
				}
			});
		});

		return () => {
			socket.off("other-user-position");
		};
	}, []);

	const CustomTick = React.memo(
		({ x, y, payload, currentUsersPage }) => {
			// console.log("x", x, "y", y, "payload", payload);

			// console.log(currentUsersPage);
			// 페이지 활성화 상태를 나타내는 배열 생성, 초기값은 모두 0 (비활성화)
			let isActiveArray = new Array(book?.totalPage || 0).fill(0);

			// 현재 페이지에 해당하는 사용자들을 필터링
			const usersOnPage = currentUsersPage.filter((user) => Number(user.currentPage) === Number(payload.value));
			// 본인의 프로필을 배열의 첫 번째 요소로, 다른 사용자들은 그 뒤로 정렬
			const sortedUsersOnPage = usersOnPage.sort((a, b) => (b.id === roomUser?.user.id ? -1 : 1));
			// currentUsers를 순회하면서, 각 사용자의 페이지를 확인
			sortedUsersOnPage.forEach((user) => {
				if (Number(user.currentPage) === Number(payload.value)) {
					// 해당 사용자의 페이지가 현재 payload.value와 일치하면, 활성화 상태를 1로 설정
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
									border: `2px solid ${coloringUser(user.id)}`,
									borderShadow: `0 0 0 3px ${coloringUser(user.id)}`,
									filter: index === arr.length - 1 ? "none" : "grayscale(50%)", // 마지막 사용자(본인)는 필터 없음, 나머지는 그레이스케일
								}}
								alt={`User ${user.id}`}
							/>
						</foreignObject>
					))}
				</g>
			);
		},
		(prevProps, nextProps) => {
			// prop 비교 로직을 추가하여 실제로 필요한 경우에만 리렌더링 되도록 함
			return (
				prevProps.payload.value === nextProps.payload.value &&
				prevProps.x === nextProps.x &&
				prevProps.y === nextProps.y
			);
		}
	);
	CustomTick.displayName = "CustomTick";

	const customClick = (props) => {
		const handleClick = () => {
			// console.log(props.value);
			// 페이지 이동 로직 실행
			// navigateToPage(payload.value);
			navigate(`/room/${roomId}/book/${bookId}?page=${props.value}`);
		};

		handleClick();
	};

	return (
		// width="25%" height={650} style={{ position: "sticky", top: "20px" }}
		<div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
						tick={<CustomTick currentUsersPage={currentUsersPage} />}
						onClick={customClick}
					/>
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip cursor={{ stroke: coloringUser(roomUser?.user.id), strokeWidth: 2 }} />
					{[
						...roomUsers.filter((user) => user.id !== roomUser.user.id),
						...roomUsers.filter((user) => user.id === roomUser.user.id),
					]?.map((user, index) => (
						<Area
							key={user.id}
							type="monotone"
							dataKey={user.id}
							stroke={coloringUser(user.id)} // 사용자별 고유 색상으로 stroke 설정
							fillOpacity={0.8}
							fill={coloringUser(user.id)} // 사용자별 고유 색상으로 fill 설정
						/>
					)) || []}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

export default Chart;
