import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "./Sidebar";
import ClientRoom from "./ClientRoom";
import socket from "socket.js";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

// 무작위 uuid 값 만들기. GPT에서 crypto 함수를 추천했음.
const createUuid = () => {
	var S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};
/* GPT 코드
 * const crypto = require('crypto');
 * const uuid = crypto.randomUUID();
 * console.log(uuid);
 **/

const DrawingCanvas = () => {
	const [roomJoined, setRoomJoined] = useState(false);
	const [user, setUser] = useRecoilState(userState);
	const [socketUser, setSocketUser] = useState(null);
	const [users, setUsers] = useState([]);
	const { roomId, bookId } = useParams();
	const uuid = createUuid();

	useEffect(() => {
		setRoomJoined(true);
		setSocketUser({
			isLogin: user?.token,
			roomId: roomId,
			bookId: bookId,
			memberId: user?.id,
			userId: uuid,
			userName: "host",
			host: true,
			presenter: true,
		});
	}, [user]);

	useEffect(() => {
		if (roomJoined) {
			socket.emit("user-joined", socketUser);
		}
	}, [roomJoined]);

	useEffect(() => {
		if (socketUser) {
			socket.emit("user-changed", socketUser);
		}
	}, [socketUser]);

	useEffect(() => {
		socket.on("users", (data) => {
			// 각 사용자의 userId와 bookId를 조합하여 canvasId를 생성
			const updatedUsers = data.map((user) => ({
				...user,
				canvasId: `${user.userId}`, // userId와 bookId를 결합하여 canvasId 생성
			}));
			setUsers(updatedUsers); // 상태 업데이트
		});
	}, []);

	return (
		<div className="home">
			{/* <ToastContainer /> */}
			<>
				<Sidebar users={users} user={socketUser} />
				{/* <UtilButton /> */}
				{users.map((user, index) => (
					<ClientRoom key={index} canvasId={user.canvasId} setUsers={setUsers} />
				))}
			</>
		</div>
	);
};

const UtilButton = () => {
	return (
		<>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-2">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 노란색 버튼
							className="btn btn-warning"
							value="load canvas #time (미구현)"
							// onClick={loadCanvas}
						/>
					</div>
				</div>
			</div>
			<div className="row justify-content-center align-items-center text-center py-2">
				<div className="col-md-1">
					<div className="color-picker d-flex align-items-center justify-content-center">
						<input
							type="button"
							// 초록색 버튼
							className="btn btn-success"
							value="save canvas"
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DrawingCanvas;
