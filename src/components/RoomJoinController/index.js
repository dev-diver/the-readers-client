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
		if (user) {
			const myRoomUser = {
				roomId: roomId,
				userId: user.id,
				userName: user.nick,
			};
			setRoomUser(myRoomUser);
			socket.emit("room-joined", myRoomUser);
		}
		return () => {
			socket.off("room-joined");
		};
	}, [user]);

	useEffect(() => {
		socket.on("room-users-changed", (data) => {
			// 각 사용자의 userId와 bookId를 조합하여 canvasId를 생성
			const updatedUsers = data.map((user) => ({
				...user,
				canvasId: `${user.userId}`, // userId와 bookId를 결합하여 canvasId 생성
			}));
			setRoomUsers(updatedUsers); // 상태 업데이트
		});
		return () => {
			socket.off("room-users-changed");
		};
	}, []);

	return (
		<div>
			<ToastContainer />
			RoomJoinController
		</div>
	);
}
