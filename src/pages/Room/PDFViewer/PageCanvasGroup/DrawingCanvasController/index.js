import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import socket from "socket";
import { useRecoilState } from "recoil";
import { getCanvasRef, imageToCanvas } from "./util";
import { bookChangedState, roomUsersState, drawingCanvasRefsState } from "recoil/atom";

export default function DrawingCanvasController({ totalPage }) {
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [initialize, setInitialize] = useState(false);

	useEffect(() => {
		console.log("totalPage", totalPage, "roomUsers", roomUsers, "initialize", initialize);
		if (totalPage === 0 || roomUsers?.length == 0 || initialize) return;
		// console.log("roomUsers", roomUsers);
		const newRefs = new Array(totalPage).fill(null).map((e, i) => {
			const roomRefs = roomUsers.reduce((acc, user) => {
				acc[user] = React.createRef();
				return acc;
			}, {});
			return { page: i + 1, userRefs: roomRefs };
		});
		// console.log("newRefs", newRefs);
		setInitialize(true);
		setBookChanged((prev) => !prev);
		setDrawingCanvasRefs(newRefs);
	}, [totalPage, roomUsers, initialize]);

	useEffect(() => {
		setInitialize(false);
	}, [totalPage, roomUsers]);

	useEffect(() => {
		const handleShareCanvas = (data) => {
			if (data) {
				const { user, canvasImage, location } = data;
				const canvasRef = getCanvasRef(drawingCanvasRefs, location.pageNum, user.id);
				imageToCanvas(canvasImage, canvasRef);
			}
		};

		socket.on("share-canvas", handleShareCanvas);
		return () => {
			socket.off("canvasImage", handleShareCanvas);
		};
	}, [drawingCanvasRefs]);

	return <></>;
}
