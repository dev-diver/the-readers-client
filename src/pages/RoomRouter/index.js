import React from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import RoomLobby from "pages/RoomRouter/RoomLobby";
import Room from "pages/RoomRouter/Room";
import RoomJoinController from "components/RoomJoinController";
import VideoChat from "components/VideoChat";
import SwitchController from "components/Draggable/SwitchController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";
import DRoom from "pages/RoomRouter/3DRoom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./transition.css";

function RoomRouter() {
	const { roomId } = useParams();
	const location = useLocation();

	return (
		<>
			<RoomJoinController roomId={roomId} />
			{/* <VideoChat /> */}
			{/* <DraggableElement startX={window.innerWidth - 300} startY={120}>
				<SwitchController />
			</DraggableElement> */}
			{/* <TransitionGroup>
				<CSSTransition key={location.pathname} classNames="fade" timeout={1000}> */}
			<Routes location={location}>
				<Route path="/" element={<DRoom />} />
				<Route path="/book/:bookId" element={<Room />} />
			</Routes>
			{/* </CSSTransition>
			</TransitionGroup> */}
		</>
	);
}

export default RoomRouter;
