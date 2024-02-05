import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import RoomJoinController from "components/RoomJoinController";

function RoomRouter() {
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
