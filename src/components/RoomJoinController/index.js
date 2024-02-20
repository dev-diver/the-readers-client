import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import socket from "socket";
import { useRecoilState } from "recoil";
import { userState, roomUserState, roomUsersState, roomState } from "recoil/atom";
import api from "api";

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
	const [room, setRoom] = useRecoilState(roomState);

	// const uuid = createUuid();

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			setRoom(response.data.data);
		});
	}, [roomId]);

	useEffect(() => {
		if (!user || !roomId) return;
		const onMessageHandler = (data) => {
			console.log("message", data.message);
		};

		socket.on("message", onMessageHandler);
		return () => {
			socket.off("message", onMessageHandler);
		};
	}, [user, roomId]);

	useEffect(() => {
		if (user && roomId) {
			console.log("roomJoined", user, "roomId", roomId);
			const myRoomUser = {
				user: user,
				roomId: roomId,
			};
			setRoomUser(myRoomUser);
			socket.emit("room-joined", myRoomUser);
		} else {
			console.log("roomLeaved", user, "roomId", roomId);
			socket.emit("room-leaved", roomUser);
			if (!user) {
				setRoomUser(null);
				setRoomUsers([]);
			}
		}
	}, [user, roomId]);

	useEffect(() => {
		const handleRoomUsersChanged = (data) => {
			// console.log("room-users-changed", data.roomUsers);
			//lougout시 excludeMe.
			//highlight 삭제 등을 할 때 남은 roomUsers 목록이 의미 없으므로 내 로그인은 따로 처리해줘야 함
			setRoomUsers(data.roomUsers);
		};
		socket.on("room-users-changed", handleRoomUsersChanged);
		return () => {
			socket.off("room-users-changed", handleRoomUsersChanged);
		};
	}, [user, roomId]);

	return <></>;
}
