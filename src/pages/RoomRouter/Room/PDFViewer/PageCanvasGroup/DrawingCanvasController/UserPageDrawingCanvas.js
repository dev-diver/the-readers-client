import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { userState, penModeState, canvasElementsFamily, pageLoadingStateFamily } from "recoil/atom";
import { debounceDrawSave } from "./utils";
import { blobToJson } from "./utils";

import rough from "roughjs/bundled/rough.esm";
import socket from "socket";
import api from "api";

const generator = rough.generator();

function UserPageDrawingCanvas({ index, roomUser, pageNum, canvasFrame }) {
	const { bookId, roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [isDrawing, setIsDrawing] = useState(false);
	const canvasRef = useRef(null);
	const elements = useRecoilValue(canvasElementsFamily({ bookId: bookId, pageNum: pageNum, userId: roomUser.id }));
	const loadingState = useRecoilValue(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum }));

	const setElements = useSetRecoilState(
		canvasElementsFamily({ bookId: bookId, pageNum: pageNum, userId: roomUser.id })
	);

	const updateElement = useCallback(
		(newElement) => {
			setElements((prevElements) => [...prevElements, newElement]);
		},
		[setElements]
	);

	const deleteElement = ({ offsetX, offsetY }) => {
		setElements((prevElements) => {
			//prevElements 중에 offsetX, offsetY가 일치하는 element를 제외한 배열을 반환
			return prevElements.filter((ele) => {
				if (ele.element === "pencil") {
					const path = ele.path;
					const isErase = path.some(([x, y]) => {
						return Math.abs(x - offsetX) < 10 && Math.abs(y - offsetY) < 10;
					});
					return !isErase;
				}
			});
		});
	};

	const location = {
		bookId: bookId,
		roomId: roomId,
		pageNum: pageNum,
	};

	useEffect(() => {
		// console.log("draw-canvas", pageNum, loadingState);
		if (!canvasRef?.current || loadingState != "loaded") {
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
				console.log("기존 자료 없음", bookId, pageNum, roomUser.id, loadingState);
			});
	}, [canvasRef.current, loadingState]);

	useLayoutEffect(() => {
		// console.log("draw-canvas", elements, roomUser.id);
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
			// const jsonString = JSON.stringify(data); //json은 너무 느림
			// const dataBlob = new Blob([jsonString], { type: "application/json" });
			// console.log(dataBlob);
			const data = {
				user: user,
				location: location,
				elements: elements,
			};
			socket.emit("draw-canvas", data);
		}
	}, [elements, user]);

	const drawMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		if (penMode === "pencil") {
			const newElement = {
				offsetX,
				offsetY,
				path: [[offsetX, offsetY]],
				stroke: user.color,
				element: penMode,
			};
			updateElement(newElement);
		} else if (penMode === "eraser") {
			deleteElement({ offsetX, offsetY });
		} else {
			const newElement = { offsetX, offsetY, stroke: user.color, element: penMode };
			updateElement(newElement);
		}
		setIsDrawing(true);
	};

	const drawMouseMove = (e) => {
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = e.nativeEvent;

		if (penMode === "rect") {
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
		} else if (penMode === "line") {
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
		} else if (penMode === "pencil") {
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
		} else if (penMode === "eraser") {
			deleteElement({ offsetX, offsetY });
		}
	};

	const drawMouseUp = () => {
		setIsDrawing(false);
		if (!canvasRef || !user) return;
		debounceDrawSave(elements, location, user?.id);
	};

	return (
		<canvas
			key={`drawing-canvas-${index}`}
			id={`drawing-canvas-${pageNum}-${roomUser.id}`}
			ref={canvasRef}
			width={canvasFrame.scrollWidth}
			height={canvasFrame.scrollHeight}
			style={{
				border: "1px solid black",
				pointerEvents: (penMode == "pencil" || penMode == "eraser") && roomUser.id == user?.id ? "auto" : "none",
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
