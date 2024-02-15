import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { userState, penModeState, canvasElementsFamily } from "recoil/atom";
import { debounce } from "lodash";
import { blobToJson } from "./utils";

import rough from "roughjs/bundled/rough.esm";
import socket from "socket";
import api from "api";

const generator = rough.generator();
const tool = "pencil";
const color = "black";

function UserPageDrawingCanvas({ index, roomUser, pageNum, canvasFrame }) {
	const { bookId, roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [penMode, setPenMode] = useRecoilState(penModeState);

	const [isDrawing, setIsDrawing] = useState(false);
	const canvasRef = useRef(null);
	const elements = useRecoilValue(canvasElementsFamily({ bookId: bookId, pageNum: pageNum, userId: roomUser.id }));

	const setElements = useSetRecoilState(
		canvasElementsFamily({ bookId: bookId, pageNum: pageNum, userId: roomUser.id })
	);

	const updateElement = useCallback(
		(newElement) => {
			setElements((oldElements) => [...oldElements, newElement]);
		},
		[setElements]
	);

	const location = {
		bookId: bookId,
		roomId: roomId,
		pageNum: pageNum,
	};

	useEffect(() => {
		if (!canvasRef?.current) {
			return;
		}
		api
			.get(`/drawings/book/${bookId}/page/${pageNum}/user/${roomUser.id}`, { responseType: "blob" })
			.then((response) => {
				const elementsBlob = response.data;
				console.log("기존 자료 있음", elementsBlob);
				blobToJson(elementsBlob).then((json) => {
					console.log("복호화", json);
					setElements(json);
				});
			})
			.catch((err) => {
				// console.log("기존 자료 없음", bookId, pageNum, roomUser.id);
			});
	}, [canvasRef.current]);

	useLayoutEffect(() => {
		console.log("draw-canvas", elements, roomUser.id);
		if (!canvasRef || !user) return;
		const roughCanvas = rough.canvas(canvasRef.current);
		canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		elements.forEach((ele, i) => {
			if (ele.element === "rect") {
				roughCanvas.draw(
					generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
						stroke: ele.stroke,
						roughness: 0,
						strokeWidth: 5,
					})
				);
			} else if (ele.element === "line") {
				roughCanvas.draw(
					generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
						stroke: ele.stroke,
						roughness: 0,
						strokeWidth: 5,
					})
				);
			} else if (ele.element === "pencil") {
				roughCanvas.linearPath(ele.path, {
					stroke: ele.stroke,
					roughness: 0,
					strokeWidth: 5,
				});
			}
		});

		if (roomUser.id == user?.id) {
			const data = {
				user: user,
				location,
				elements: elements,
			};
			socket.emit("draw-canvas", data);
		}
		// const jsonString = JSON.stringify(data);
		// const dataBlob = new Blob([jsonString], { type: "application/json" });
		// console.log(dataBlob);
	}, [elements, user]);

	const drawMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		if (tool === "pencil") {
			const newElement = {
				offsetX,
				offsetY,
				path: [[offsetX, offsetY]],
				stroke: color,
				element: tool,
			};
			updateElement(newElement);
		} else {
			const newElement = { offsetX, offsetY, stroke: color, element: tool };
			updateElement(newElement);
		}
		setIsDrawing(true);
	};

	const drawMouseMove = (e) => {
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = e.nativeEvent;

		if (tool === "rect") {
			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								offsetX: ele.offsetX,
								offsetY: ele.offsetY,
								width: offsetX - ele.offsetX,
								height: offsetY - ele.offsetY,
								stroke: ele.stroke,
								element: ele.element,
							}
						: ele
				)
			);
		} else if (tool === "line") {
			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								offsetX: ele.offsetX,
								offsetY: ele.offsetY,
								width: offsetX,
								height: offsetY,
								stroke: ele.stroke,
								element: ele.element,
							}
						: ele
				)
			);
		} else if (tool === "pencil") {
			setElements((prevElements) =>
				prevElements.map((ele, index) =>
					index === elements.length - 1
						? {
								offsetX: ele.offsetX,
								offsetY: ele.offsetY,
								path: [...ele.path, [offsetX, offsetY]],
								stroke: ele.stroke,
								element: ele.element,
							}
						: ele
				)
			);
		}
	};

	const drawMouseUp = () => {
		setIsDrawing(false);
		// const canvasRef = getCanvasRef(drawingCanvasRefs, pageNum, user.id);
		if (!canvasRef) return;
		const data = {
			user: user,
			location,
			elements: elements,
		};
		debounceDrawSave(data);
	};

	const debounceDrawSave = debounce((data) => {
		//draw save 로직  /book/:bookId/page/:pageNum/user/:userId 주소로 요청
		const { bookId, pageNum } = data.location;

		const jsonString = JSON.stringify(data.elements);
		const elementsBlob = new Blob([jsonString], { type: "application/json" });
		const formData = new FormData();
		formData.append("file", elementsBlob, "drawing.json");
		console.log(data);
		api.post(`/drawings/book/${bookId}/page/${pageNum}/user/${user.id}`, formData).catch((err) => {
			console.log(err);
		});
	}, 1000);

	return (
		<canvas
			key={`drawing-canvas-${index}`}
			id={`drawing-canvas-${pageNum}-${roomUser.id}`}
			ref={canvasRef}
			width={canvasFrame.scrollWidth}
			height={canvasFrame.scrollHeight}
			style={{
				border: "1px solid black",
				pointerEvents: penMode == "draw" && roomUser.id == user?.id ? "auto" : "none",
				position: "absolute",
				left: 0,
				top: 0,
			}}
			onMouseDown={drawMouseDown}
			onMouseMove={drawMouseMove}
			onMouseUp={drawMouseUp}
		></canvas>
	);
}

export default UserPageDrawingCanvas;
