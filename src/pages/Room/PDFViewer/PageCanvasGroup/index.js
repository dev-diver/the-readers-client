import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { useParams, useSetCanvasRef } from "react-router-dom";
import { useRecoilState } from "recoil";
import { canvasMouse, clearCanvas } from "./CursorCanvasController/util";
import { getCanvasRef } from "./DrawingCanvasController/util";
import {
	userState,
	roomUserState, //roomUser로 바꾸는 게 더 맞을 듯
	roomUsersState,
	cursorCanvasRefsState,
	drawingCanvasRefsState,
	penModeState,
	bookChangedState,
} from "recoil/atom";
import rough from "roughjs/bundled/rough.esm";
import socket from "socket";
import { produce } from "immer";

function PageCanvasGroup({ pageNum, canvasFrame }) {
	const { bookId, roomId } = useParams();
	// 여기에서 추가하기
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [cursorCanvasRefs, setCursorCanvasRefs] = useRecoilState(cursorCanvasRefsState);
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);

	const [penMode, setPenMode] = useRecoilState(penModeState);

	const setRef = useCallback(
		(el) => {
			setCursorCanvasRefs((oldRefs) => {
				const newRefs = oldRefs.map((pageRef) => {
					if (pageRef.page === pageNum) {
						return { ...pageRef, ref: { current: el } };
					}
					return pageRef;
				});
				return newRefs;
			});
		},
		[pageNum, bookChanged, setCursorCanvasRefs]
	);

	const isAllRefSet = (refs) => {
		// console.log("refs", refs);
		if (refs.length === 0) return false;
		return refs.every((pageRef) => {
			// console.log("page ref", pageRef);
			if (Object.keys(pageRef.userRefs).length === 0) return false;
			return Object.values(pageRef.userRefs).every((userRef) => {
				console.log(!!userRef.current);
				return !!userRef.current;
			});
		});
	};

	const setDrawingRef = useCallback(
		(el, userId) => {
			let flag = isAllRefSet(drawingCanvasRefs);
			// console.log("isAllRefset", flag);
			if (flag) {
				// console.log("All refs are set");
				return;
			}
			setDrawingCanvasRefs((oldRefs) => {
				const newRefs = produce(oldRefs, (draftRefs) => {
					draftRefs.forEach((pageRef) => {
						if (pageRef.page === pageNum) {
							let userRefs = pageRef.userRefs[userId];
							// console.log("userRefs", userRefs);
							if (!userRefs?.current) {
								pageRef.userRefs[userId] = { current: el };
							}
						}
					});
					// console.log("draftRefs", draftRefs);
				});
				// console.log("newRefs", newRefs);
				return newRefs;
			});
		},
		[setDrawingCanvasRefs] // 의존성 배열에 pageNum과 setDrawingCanvasRefs를 포함합니다.
	);

	const info = { user: user, bookId: bookId, pageNum: pageNum };

	return (
		<div className="page-canvas-group">
			<canvas
				id={`pointer-canvas-${pageNum}`}
				ref={setRef}
				width={canvasFrame.scrollWidth}
				height={canvasFrame.scrollHeight}
				style={{
					border: "1px solid black",
					pointerEvents: penMode == "pointer" ? "auto" : " none",
					position: "absolute",
					left: 0,
					top: 0,
				}}
				onMouseMove={(e) => canvasMouse(e, info)}
				onMouseOut={(e) => {
					//socket 신호가 더 늦게와서 다시 그려짐
					clearCanvas(e.target);
				}}
			></canvas>
			<DrawingCanvases
				pageNum={pageNum}
				roomUsers={roomUsers}
				canvasFrame={canvasFrame}
				setDrawingRef={setDrawingRef}
			/>
		</div>
	);
}

const generator = rough.generator();
const tool = "pencil";
const color = "black";
function DrawingCanvases({ pageNum, roomUsers, canvasFrame, setDrawingRef }) {
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const { bookId, roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [penMode, setPenMode] = useRecoilState(penModeState);

	const [isDrawing, setIsDrawing] = useState(false);
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);
	const [elements, setElements] = useState([]);

	const location = {
		bookId: bookId,
		roomId: roomId,
		pageNum: pageNum,
	};

	useLayoutEffect(() => {
		if (drawingCanvasRefs.length === 0) return;
		if (!user) return;
		const canvasRef = getCanvasRef(drawingCanvasRefs, pageNum, user.id);
		if (!canvasRef) {
			return;
		}
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
		const canvasImage = canvasRef.toDataURL();
		const data = {
			user: user,
			location,
			canvasImage,
		};
		// console.log("location", location.roomId);
		// console.log("data", data);
		socket.emit("draw-canvas", data);
	}, [drawingCanvasRefs.length, elements, user]);

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
	};

	return (
		<>
			{roomUsers?.map((roomUser, i) => (
				<canvas
					key={`drawing-canvas-${i}`}
					id={`drawing-canvas-${pageNum}-${roomUser.id}`}
					ref={(el) => setDrawingRef(el, roomUser.id)}
					width={canvasFrame.scrollWidth}
					height={canvasFrame.scrollHeight}
					style={{
						border: "1px solid black",
						// pointerEvents: "none",
						// pointerEvents: penMode =="draw" && user id랑 같은지
						// pointerEvents: penMode == "draw" ? "auto" : " none",
						// TODO: 본인 id가 아니면 mouseEvent 없애야 함.
						pointerEvents: penMode == "draw" && roomUser.id == user.id ? "auto" : "none",
						position: "absolute",
						left: 0,
						top: 0,
					}}
					onMouseDown={drawMouseDown}
					onMouseMove={drawMouseMove}
					onMouseUp={drawMouseUp}
				></canvas>
			)) || []}
		</>
	);
}

export default PageCanvasGroup;
