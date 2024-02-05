import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import RoomJoinController from "components/RoomJoinController";

function RoomRouter() {
	// useParams 훅을 사용하여 현재 경로의 파라미터를 가져옵니다.
	const { roomId } = useParams();

	return (
		<div>
			<RoomJoinController roomId={roomId} />
			<Routes>
				<Route path="/" element={<RoomLobby />} />
				<Route path="book/:bookId" element={<Room />} />
			</Routes>
		</div>
	);
}

export default RoomRouter;
