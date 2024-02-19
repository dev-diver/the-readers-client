import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import RoomJoinController from "components/RoomJoinController";
import DRoom from "pages/3DRoom";

function RoomRouter() {
	const { roomId } = useParams();

	return (
		<>
			<RoomJoinController roomId={roomId} />
			<Routes>
				<Route path="/" element={<DRoom />} />
				<Route path="/book/:bookId" element={<Room />} />
			</Routes>
		</>
	);
}

export default RoomRouter;
