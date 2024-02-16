import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "socket";
import { useRecoilCallback, useRecoilState } from "recoil";
import { canvasElementsFamily, canvasHistoryFamily, userState } from "recoil/atom";
import { Button } from "@mui/material";
import { debounceDrawSave } from "./utils";

const useUndoRedo = () => {
	const undo = useRecoilCallback(
		({ snapshot, set }) =>
			async (roomId, bookId, pageNum, userId) => {
				const Key = { roomId: roomId, bookId: bookId, pageNum: pageNum, userId: userId };
				const currentElements = await snapshot.getPromise(canvasElementsFamily(Key));
				//const currentHistory = snapshot.getLoadable(canvasHistoryFamily(elementsKey)).getValue();
				if (currentElements.length > 0) {
					const newHistoryItem = currentElements[currentElements.length - 1];

					const newElements = await snapshot
						.getPromise(canvasElementsFamily(Key))
						.then((prevElements) => prevElements.filter((ele, index) => index !== currentElements.length - 1));
					set(canvasHistoryFamily(Key), (prevHistory) => [...prevHistory, newHistoryItem]);
					set(canvasElementsFamily(Key), newElements);

					debounceDrawSave(newElements, Key, userId);
				}
			},
		[]
	);

	const redo = useRecoilCallback(
		({ snapshot, set }) =>
			async (roomId, bookId, pageNum, userId) => {
				const Key = { roomId: roomId, bookId: bookId, pageNum: pageNum, userId: userId };
				// const currentElements = snapshot.getLoadable(canvasElementsFamily(Key)).getValue();
				const currentHistory = await snapshot.getPromise(canvasHistoryFamily(Key));
				if (currentHistory.length > 0) {
					const currentHistoryItem = currentHistory[currentHistory.length - 1];
					const newElements = await snapshot
						.getPromise(canvasElementsFamily(Key))
						.then((prevElements) => [...prevElements, currentHistoryItem]);

					set(canvasElementsFamily(Key), newElements);
					set(canvasHistoryFamily(Key), (prevHistory) =>
						prevHistory.filter((ele, index) => index !== currentHistory.length - 1)
					);
					debounceDrawSave(newElements, Key, userId);
				}
			},
		[]
	);

	return { undo, redo };
};

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
