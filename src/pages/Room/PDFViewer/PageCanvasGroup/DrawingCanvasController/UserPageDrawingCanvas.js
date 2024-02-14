import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getCanvasRef, imageToCanvas } from "./util";
import { userState, drawingCanvasRefsState, penModeState } from "recoil/atom";
import { debounce } from "lodash";

import rough from "roughjs/bundled/rough.esm";
import socket from "socket";
import api from "api";

const generator = rough.generator();
const tool = "pencil";
const color = "black";

function UserPageDrawingCanvas({ index, roomUser, pageNum, canvasFrame, setDrawingRef }) {
	const { bookId, roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [penMode, setPenMode] = useRecoilState(penModeState);

	const [isDrawing, setIsDrawing] = useState(false);
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);
	const [canvasRef, setCanvasRef] = useState(null);
	const [elements, setElements] = useState([]);

	const location = {
		bookId: bookId,
		roomId: roomId,
		pageNum: pageNum,
	};

	useEffect(() => {
		const canvasRef = getCanvasRef(drawingCanvasRefs, pageNum, roomUser.id);
		setCanvasRef(canvasRef);
	}, [drawingCanvasRefs]);

	useEffect(() => {
		if (!canvasRef) {
			return;
		}
		// console.log("load drawing", canvasRef, bookId, pageNum, roomUser.id);
		api
			.get(`/drawings/book/${bookId}/page/${pageNum}/user/${roomUser.id}`, { responseType: "blob" })
			.then((response) => {
				const canvasImage = URL.createObjectURL(response.data);
				console.log("로드 성공", canvasImage);
				imageToCanvas(canvasImage, canvasRef, () => {
					URL.revokeObjectURL(canvasImage);
				});
			})
			.catch((err) => {
				// console.log("기존 자료 없음", bookId, pageNum, roomUser.id);
			});
	}, [canvasRef]);

	useLayoutEffect(() => {
		if (!canvasRef || !user) return;
		const roughCanvas = rough.canvas(canvasRef);
		if (elements.length > 0) {
			canvasRef.getContext("2d").clearRect(0, 0, canvasRef.width, canvasRef.height);
		}
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

		canvasRef.toBlob((blob) => {
			const data = {
				user: user,
				location,
				canvasImage: blob,
			};
			socket.emit("draw-canvas", data);
		}, "image/png");
	}, [elements, user]);

	const drawMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		if (tool === "pencil") {
			setElements((prevElements) => [
				...prevElements,
				{
					offsetX,
					offsetY,
					path: [[offsetX, offsetY]],
					stroke: color,
					element: tool,
				},
			]);
		} else {
			setElements((prevElements) => [...prevElements, { offsetX, offsetY, stroke: color, element: tool }]);
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

		const canvasRef = getCanvasRef(drawingCanvasRefs, pageNum, user.id);
		canvasRef.toBlob((blob) => {
			const data = {
				user: user,
				location,
				canvasImage: blob,
			};
			debounceDrawSave(data);
		}, "image/png");
	};

	const debounceDrawSave = debounce((data) => {
		//draw save 로직  /book/:bookId/page/:pageNum/user/:userId 주소로 요청
		const formData = new FormData();
		const { bookId, pageNum } = data.location;
		formData.append("file", data.canvasImage);
		console.log(data);
		api.post(`/drawings/book/${bookId}/page/${pageNum}/user/${user.id}`, formData).catch((err) => {
			console.log(err);
		});
	}, 1000);

	return (
		<canvas
			key={`drawing-canvas-${index}`}
			id={`drawing-canvas-${pageNum}-${roomUser.id}`}
			ref={(el) => setDrawingRef(el, roomUser.id)}
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
