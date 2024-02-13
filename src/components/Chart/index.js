import React, { useState, useEffect, PureComponent } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useRecoilState } from "recoil";
import { roomUserState, roomUsersState, scrollYState } from "recoil/atom";
import socket from "socket";
import { Button } from "@mui/material";
import { set } from "lodash";

// 미리 정의된 색상 배열
function coloringUser(userId) {
	const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff3864"];
	return colors[(Number(userId) - 1) % colors.length];
}

function Chart() {
	const [scroll, setScroll] = useRecoilState(scrollYState);
	const [prevScroll, setPrevScroll] = useState(0);
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [currentUsersPage, setCurrentUsersPage] = useState([]);
	// useEffect(() => {
	// 	console.log("roomUsers", roomUsers);
	// 	console.log("roomUser", roomUser);
	// }, []);

	useEffect(() => {
		console.log("currentUsersPage", currentUsersPage);
		console.log("data", data);
	}, [scroll]);

	useEffect(() => {
		// 페이지 데이터를 초기화하는 함수
		const initializePageData = () => {
			return new Array(30).fill(null).map((_, index) => {
				const pageObject = { page: `${index + 1}` }; // 기본 page 설정
				roomUsers.forEach((user) => {
					const userIdKey = user?.id; // 각 사용자 ID에 대한 키 생성
					pageObject[userIdKey] = 0; // 해당 사용자 ID 키를 객체에 추가하고 0으로 초기화
				});
				return pageObject;
			});
		};

		// 기존 데이터를 업데이트하는 함수
		const updatePageDataWithNewUsers = (existingData) => {
			return (
				existingData?.map((pageObject) => {
					const updatedPageObject = { ...pageObject }; // 기존 페이지 객체 복사
					roomUsers?.forEach((user) => {
						const userIdKey = user?.id; // 각 사용자 ID에 대한 키
						// 해당 사용자 ID 키가 없거나 새로운 유저일 경우 0으로 초기화
						if (!Object.hasOwnProperty.call(updatedPageObject, userIdKey)) {
							updatedPageObject[userIdKey] = 0;
						}
					}) || [];
					return updatedPageObject;
				}) || []
			);
		};

		// 데이터가 이미 있으면 업데이트하고, 없으면 초기화
		const updatedOrInitializedData = data?.length === 0 ? initializePageData() : updatePageDataWithNewUsers(data);

		setData(updatedOrInitializedData); // 업데이트된 또는 초기화된 데이터로 상태
	}, [roomUsers]); // roomUsers가 변경될 때마다 이 로직을 다시 실행

	useEffect(() => {
		const handleUpdateChart = (userData) => {
			const { filteredData, userKey } = userData;
			// console.log("****received data from server****");
			// console.log("filteredData", filteredData);
			// console.log("userKey", userKey);
			setData((prevData) => {
				// prevData의 깊은 복사본을 생성합니다.
				const updatedData = prevData.map((item) => {
					// filteredUpdateData에서 현재 순회 중인 page와 일치하는 항목을 찾습니다.
					const updateItem = filteredData.find((update) => update.page === item.page);

					// 일치하는 항목이 있는 경우, 해당 userKey2의 값을 업데이트합니다.
					if (updateItem) {
						// 여기서는 'userKey2'가 업데이트 대상 키라고 가정합니다.
						// 'userKey2'를 업데이트하고 나머지 항목(rest)은 그대로 유지합니다.
						return { ...item, [userKey]: updateItem[userKey] ?? item[userKey] };
					}

					// 일치하는 항목이 없는 경우, 원본 항목을 반환합니다.
					return item;
				});
				// console.log("updatedData", updatedData);
				return updatedData;
			});
		};
		socket.on("update-chart", handleUpdateChart);
		// console.log("roomUsers", roomUsers);
		return () => {
			socket.off("update-chart", handleUpdateChart);
		};
	}, []);

	useEffect(() => {
		setPrevScroll(scroll);
		// 1초마다 count 증가
		const interval = setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);
		console.log("data", data);

		// 컴포넌트가 언마운트될 때 인터벌 정리
		return () => clearInterval(interval);
	}, [scroll]);

	// count는 스크롤 이벤트가 한 번 발생한 이후부터 시작. 그 전엔 카운트 안 셈.
	// data에서 prevScroll에 해당하는 값이 time 키와 같을 때 그 값을 1초에 1씩 증가시킴
	// count가 prevScroll 값이 바뀔 때마다 0으로 초기화되는 기능 포함
	useEffect(() => {
		// data가 {}일 때는 !data로 잡히지 않으므로 추가로 조건문을 걸어줌
		if (!data || ("object" && Object.keys(data).length === 0)) return;
		const userKey = roomUser?.user?.id;
		let page = 0;
		const updatedData = data.map((item) => {
			if (Number(item.page) === prevScroll) {
				// data의 parseInt(item.page)과 같은 값의 page를 찾아 time을 count만큼 증가시킴
				const count_tmp = count;
				setCount(0);
				// 사용자 ID에 해당하는 키의 값을 업데이트하거나 초기화
				const newItem = {
					...item,
					[userKey]: item[userKey] + count_tmp,
				};
				page = Number(item.page);

				return newItem;
			}
			return item;
		});
		// console.log("updatedData", updatedData);

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
	}, [scroll]);

	// Hare And Tortoise
	useEffect(() => {
		if (!roomUser?.user) return;
		socket.emit("current-user-position", { scroll, user: roomUser.user, room: roomUser.roomId });
	}, [scroll]);

	useEffect(() => {
		socket.on("other-user-position", (data) => {
			const { user, scroll, flag } = data;
			if (flag === 1) {
				console.log("유저 나갈 때?? scroll", scroll);
			}
			setCurrentUsersPage((prev) => {
				// 먼저, 이전 상태에서 현재 업데이트된 사용자를 찾습니다.
				const userIndex = prev.findIndex((u) => u.id === user.id);
				// console.log("userIndex", userIndex);
				if (userIndex > -1) {
					// 사용자가 이미 존재하면, 해당 사용자의 정보를 업데이트합니다.
					const updatedUsers = [...prev];
					updatedUsers[userIndex] = { ...updatedUsers[userIndex], scroll: scroll, profileImg: user.profileImg };
					// console.log("updatedUsers", updatedUsers);
					return updatedUsers;
				} else {
					// 새 사용자라면, 배열에 추가합니다.
					// console.log("new user");
					return [...prev, { id: user.id, scroll: scroll, profileImg: user.profileImg }];
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
			let profileImgSrc = null;

			// console.log(currentUsersPage);
			// 페이지 활성화 상태를 나타내는 배열 생성, 초기값은 모두 0 (비활성화)
			let isActiveArray = new Array(30).fill(0);

			// 현재 페이지에 해당하는 사용자들을 필터링
			const usersOnPage = currentUsersPage.filter((user) => Number(user.scroll) === Number(payload.value));
			// 본인의 프로필을 배열의 첫 번째 요소로, 다른 사용자들은 그 뒤로 정렬
			const sortedUsersOnPage = usersOnPage.sort((a, b) => (b.id === roomUser.user.id ? -1 : 1));
			// currentUsers를 순회하면서, 각 사용자의 페이지를 확인
			sortedUsersOnPage.forEach((user) => {
				if (Number(user.scroll) === Number(payload.value)) {
					// 해당 사용자의 페이지가 현재 payload.value와 일치하면, 활성화 상태를 1로 설정
					isActiveArray[Number(payload.value) - 1] = 1;
					profileImgSrc = user.profileImg; // 사용자의 프로필 이미지 경로를 저장
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

	return (
		// width="25%" height={650} style={{ position: "sticky", top: "20px" }}
		<div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Button variant="outlined" sx={{ width: "30%" }}>
				갱신
			</Button>
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
					{/* <defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						</linearGradient>
					</defs> */}
					<XAxis type="number" />
					<YAxis
						dataKey="page"
						type="category"
						interval={0}
						tick={<CustomTick currentUsersPage={currentUsersPage} />}
					/>
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip />
					{roomUsers?.map((user, index) => (
						<Area
							key={user.id}
							type="monotone"
							dataKey={user.id}
							stroke={coloringUser(user.id)} // 사용자별 고유 색상으로 stroke 설정
							fillOpacity={1}
							fill={coloringUser(user.id)} // 사용자별 고유 색상으로 fill 설정
						/>
					)) || []}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

export default Chart;
