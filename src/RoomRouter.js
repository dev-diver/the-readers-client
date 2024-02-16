import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RoomLobby from "pages/RoomLobby";
import Room from "pages/Room";
import RoomJoinController from "components/RoomJoinController";
import VideoChat from "components/VideoChat";
import SwitchController from "components/Draggable/SwitchController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";

function RoomRouter() {
	const { roomId } = useParams();

	return (
		<div style={{ position: "relative" }}>
			<RoomJoinController roomId={roomId} />
			{/* <VideoChat /> */}
			{/* <DraggableElement startX={window.innerWidth - 300} startY={120}>
				<SwitchController />
			</DraggableElement> */}
			<Routes>
				<Route path="/" element={<RoomLobby />} />
				<Route path="/book/:bookId" element={<Room />} />
			</Routes>
		</div>
	);
}

export default RoomRouter;
