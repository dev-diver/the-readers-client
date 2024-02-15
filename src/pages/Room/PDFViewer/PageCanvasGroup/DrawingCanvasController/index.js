import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilCallback, useRecoilState } from "recoil";
import { canvasElementsFamily, userState } from "recoil/atom";
import { Button } from "@mui/material";

export default function DrawingCanvasController() {
	const { roomId, bookId } = useParams();
	const { undo, redo } = useUndoRedo();
	const [user, setUser] = useRecoilState(userState);

	const handleUndoClick = (pageNum, userId) => {
		undo(roomId, bookId, pageNum, userId);
	};

	const handleRedoClick = (pageNum, userId) => {
		redo(roomId, bookId, pageNum, userId);
	};

	const updateCanvasElement = useRecoilCallback(
		({ set }) =>
			(roomId, bookId, pageNum, userId, elements) => {
				const elementKey = { roomId: roomId, bookId: bookId, pageNum: pageNum, userId: userId };
				set(canvasElementsFamily(elementKey), elements);
			},
		[]
	);

	useEffect(() => {
		const handleShareCanvas = (data) => {
			// console.log("share-canvas", data);
			// const dataBlob = data;
			const { user, location, elements } = data;
			// arrayBufferToJson(dataBlob).then((json) => {
			// 	console.log("복호화", json);
			// 	const { user, location, elements } = json;
			// 	updateCanvasElement(bookId, location.pageNum, user.id, elements);
			// });
			updateCanvasElement(roomId, bookId, location.pageNum, user.id, elements);
		};
		socket.on("share-canvas", handleShareCanvas);
		return () => {
			socket.off("share-canvas", handleShareCanvas);
		};
	}, [updateCanvasElement]);

	return (
		<>
			<Button onClick={() => handleUndoClick(1, user.id)}>Undo</Button>
			<Button onClick={() => handleRedoClick(1, user.id)}>Redo</Button>
		</>
	);
}
