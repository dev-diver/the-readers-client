import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilState } from "recoil";
import { getCanvasRef, imageToCanvas } from "./util";
import { bookChangedState, roomUsersState, drawingCanvasRefsState, drawingCanvasInitState } from "recoil/atom";

export default function DrawingCanvasController({ totalPage }) {
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [initialize, setInitialize] = useRecoilState(drawingCanvasInitState);
	const { bookId } = useParams();

	useEffect(() => {
		console.log("totalPage", totalPage, "roomUsers", roomUsers, "initialize", initialize);
		if (initialize) return;
		console.error("canvasRefs reset");
		const newRefs = new Array(totalPage).fill(null).map((e, i) => {
			const roomRefs = {};
			// roomUsers.reduce((acc, user) => {
			// 	acc[user.id] = React.createRef();
			// 	return acc;
			// }, {});
			return { page: i + 1, userRefs: roomRefs };
		});
		console.log("newRefs", newRefs);
		setInitialize(true);
		setDrawingCanvasRefs(newRefs);
	}, [bookId, totalPage, roomUsers, initialize]);

	useEffect(() => {
		setInitialize(false);
	}, [totalPage, roomUsers]);

	useEffect(() => {
		const handleShareCanvas = (data) => {
			if (data) {
				const { user, canvasImage, location } = data;
				const canvasRef = getCanvasRef(drawingCanvasRefs, location.pageNum, user.id);
				// console.log("share-canvas", data, drawingCanvasRefs, canvasRef);
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
