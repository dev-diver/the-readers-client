import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { canvasElementsFamily, canvasHistoryFamily } from "recoil/atom";
import { blobToJson } from "./utils";
import { Button } from "@mui/material";

const useUndoRedo = () => {
	const undo = useRecoilCallback(
		({ snapshot, set }) =>
			(bookId, pageNum, userId) => {
				const Key = { bookId: bookId, pageNum: pageNum, userId: userId };
				const currentElements = snapshot.getLoadable(canvasElementsFamily(Key)).getValue();
				//const currentHistory = snapshot.getLoadable(canvasHistoryFamily(elementsKey)).getValue();
				console.log("undo", currentElements);
				if (currentElements.length > 0) {
					const newHistoryItem = currentElements[currentElements.length - 1];
					set(canvasHistoryFamily(Key), (prevHistory) => [...prevHistory, newHistoryItem]);
					set(canvasElementsFamily(Key), (prevElements) =>
						prevElements.filter((ele, index) => index !== currentElements.length - 1)
					);
				}
			},
		[]
	);

	const redo = useRecoilCallback(
		({ snapshot, set }) =>
			(bookId, pageNum, userId) => {
				const Key = { bookId: bookId, pageNum: pageNum, userId: userId };
				const currentElements = snapshot.getLoadable(canvasElementsFamily(Key)).getValue();
				const currentHistory = snapshot.getLoadable(canvasHistoryFamily(Key)).getValue();

				if (currentElements.length > 0) {
					const currentHistoryItem = currentHistory[currentHistory.length - 1];
					set(canvasElementsFamily(Key), (prevElements) => [...prevElements, currentHistoryItem]);
					set(canvasHistoryFamily(Key), (prevHistory) =>
						prevHistory.filter((ele, index) => index !== currentHistory.length - 1)
					);
				}
			},
		[]
	);

	return { undo, redo };
};

export default function DrawingCanvasController() {
	const { bookId } = useParams();
	const { undo, redo } = useUndoRedo();

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
			const dataBlob = data;
			blobToJson(dataBlob).then((json) => {
				console.log("복호화", json);
				const { user, location, elements } = json;
				updateCanvasElement(bookId, location.pageNum, user.id, elements);
			});
		};
		socket.on("share-canvas", handleShareCanvas);
		return () => {
			socket.off("canvasImage", handleShareCanvas);
		};
	}, [updateCanvasElement]);

	return (
		<>
			<Button onClick={() => handleUndoClick(1, 1)}>Undo</Button>
			<Button onClick={() => handleRedoClick(1, 1)}>Redo</Button>
		</>
	);
}
