import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilCallback, useRecoilState } from "recoil";
import { canvasElementsFamily, userState, currentPageState } from "recoil/atom";
import { Button } from "@mui/material";
import { useUndoRedo } from "./utils";

export default function DrawingCanvasController() {
	const { roomId, bookId } = useParams();
	const { undo, redo } = useUndoRedo();
	const [user, setUser] = useRecoilState(userState);
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);

	const handleUndoClick = (pageNum, userId) => {
		undo(bookId, pageNum, userId);
	};

	const handleRedoClick = (pageNum, userId) => {
		redo(bookId, pageNum, userId);
	};

	const updateCanvasElement = useRecoilCallback(
		({ set }) =>
			(bookId, pageNum, userId, elements) => {
				const elementKey = { bookId: bookId, pageNum: pageNum, userId: userId };
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
			updateCanvasElement(bookId, location.pageNum, user.id, elements);
		};
		socket.on("share-canvas", handleShareCanvas);
		return () => {
			socket.off("share-canvas", handleShareCanvas);
		};
	}, [updateCanvasElement]);

	return (
		<>
			{/* <Button onClick={() => handleUndoClick(currentPage, user.id)}>Undo</Button>
			<Button onClick={() => handleRedoClick(currentPage, user.id)}>Redo</Button> */}
		</>
	);
}
