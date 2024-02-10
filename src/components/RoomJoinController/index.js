import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import socket from "socket";
import { useRecoilState } from "recoil";
import { userState, roomUserState, roomUsersState } from "recoil/atom";

const createUuid = () => {
	var S4 = () => {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
};

export default function RoomJoinController({ roomId }) {
	const [user, setUser] = useRecoilState(userState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	// const uuid = createUuid();

	useEffect(() => {
		socket.on("message", (data) => {
			alert(data.message);
			// toast.info(data.message);
		});
		return () => {
			socket.off("message");
		};
	}, []);

	useEffect(() => {
		if (user && roomId) {
			const myRoomUser = {
				user: user,
				roomId: roomId,
			};
			setRoomUser(myRoomUser);
			socket.emit("room-joined", myRoomUser);
		}
		return () => {
			socket.off("room-joined");
		};
	}, [user, roomId]);

	useEffect(() => {
		socket.on("room-users-changed", (data) => {
			console.log("room-users-changed", data.roomUsers);
			setRoomUsers(data.roomUsers);
		});
		return () => {
			socket.off("room-users-changed");
		};
	}, [user]);

	return <div></div>;
}
