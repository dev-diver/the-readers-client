import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "./Sidebar";
import Room from "./Room";
import ClientRoom from "./ClientRoom";
import JoinCreateRoom from "./JoinCreateRoom";
import socket from "socket.js";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

// 무작위 uuid 값 만들기. GPT에서 crypto 함수를 추천했음.
const uuid = () => {
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
	const [userNo, setUserNo] = useState(0);
	const [roomJoined, setRoomJoined] = useState(false);
	const [user, setUser] = useState({});
	const [users, setUsers] = useState([]);
	const { roomId, bookId } = useParams();

	useEffect(() => {
		setRoomJoined(true);

		setUser({
			roomId: roomId,
			bookId: bookId,
			userId: uuid(),
			userName: "host",
			host: true,
			presenter: true,
		});
	}, []);

	useEffect(() => {
		if (roomJoined) {
			socket.emit("user-joined", user);
		}
	}, [roomJoined]);

	return (
		<div className="home">
			{/* <ToastContainer /> */}
			<>
				<Sidebar users={users} user={user} />
				<Room userNo={userNo} user={user} setUsers={setUsers} setUserNo={setUserNo} />
				<ClientRoom userNo={userNo} setUsers={setUsers} setUserNo={setUserNo} />
			</>
		</div>
	);
};
export default DrawingCanvas;
