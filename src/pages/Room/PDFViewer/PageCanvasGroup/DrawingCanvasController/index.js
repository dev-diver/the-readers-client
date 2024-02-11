import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import socket from "socket";
import { useRecoilState } from "recoil";
import { getCanvasRef } from "./util";
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
			return { page: i + 1, userRefs: {} };
		});
		console.log("newRefs", newRefs);
		setInitialize(true);
		setBookChanged((prev) => !prev);
		setDrawingCanvasRefs(newRefs);
	}, [totalPage, roomUsers, initialize]);

	useEffect(() => {
		setInitialize(false);
	}, [totalPage, roomUsers]);

	useEffect(() => {
		socket.on("share-canvas", (data) => {
			// data 객체에서 canvasId와 이미지 URL을 추출
			if (data) {
				const { user, canvasImage, location } = data;
				// console.log("canvasImage event", data);
				const canvas = getCanvasRef(drawingCanvasRefs, location.pageNum, user.id);
				// console.log("canvas", canvas);
				if (canvas) {
					const context = canvas.getContext("2d");
					const image = new Image();

					// 이미지 로드가 완료되면 실행될 함수
					image.onload = function () {
						// Canvas에 이미지 그리기
						context.clearRect(0, 0, canvas.width, canvas.height); // 이전 내용을 지웁니다.
						context.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지를 캔버스에 맞게 조정하여 그립니다.
					};

					// 이미지 소스로 Base64 URL 설정
					image.src = canvasImage;
				}
			}
		});
		return () => {
			socket.off("canvasImage");
		};
	}, [drawingCanvasRefs]);

	return <></>;
}
