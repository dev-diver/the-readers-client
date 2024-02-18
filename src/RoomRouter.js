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
			<Routes>
				<Route path="/" element={<RoomLobby />} />
				<Route path="/book/:bookId" element={<Room />} />
				<Route path="/3d" element={<DRoom />} />
			</Routes>
			<RoomJoinController roomId={roomId} />
		</>
	);
}

export default RoomRouter;
