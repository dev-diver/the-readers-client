import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import ClientRoom from "./ClientRoom";
import JoinCreateRoom from "./JoinCreateRoom";
import Room from "./Room";
import Sidebar from "./Sidebar";

import "./style.css";

const server = "http://localhost:5000";
const connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
	const [userNo, setUserNo] = useState(0);
	const [roomJoined, setRoomJoined] = useState(false);
	const [user, setUser] = useState({});
	const [users, setUsers] = useState([]);

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

	useEffect(() => {
		if (roomJoined) {
			socket.emit("user-joined", user);
		}
	}, [roomJoined]);

	return (
		<div className="home">
			<ToastContainer />
			<>
				<Sidebar users={users} user={user} socket={socket} />
				<Room userNo={userNo} user={user} socket={socket} setUsers={setUsers} setUserNo={setUserNo} />
			</>
		</div>
	);
};
export default App;
