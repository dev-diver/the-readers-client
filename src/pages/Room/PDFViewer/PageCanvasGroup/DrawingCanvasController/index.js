import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import socket from "socket";
import { useRecoilState } from "recoil";
import { getCanvasRef } from "./util";
import { bookChangedState, roomUserState, roomUsersState, drawingCanvasRefsState } from "recoil/atom";
import {} from "./util";

export default function DrawingCanvasController({ totalPage }) {
	const pointers = useRef([]);
	const [drawingCanvasRefs, setDrawingCanvasRefs] = useRecoilState(drawingCanvasRefsState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [roomUser, setRoomUser] = useRecoilState(roomUserState);
	const [initialize, setInitialize] = useState(false);

	useEffect(() => {
		if (totalPage === 0) return;
		if (roomUsers?.length == 0) return;
		if (initialize) return;
		// console.log("roomUsers", roomUsers);
		const newRefs = new Array(totalPage).fill(null).map((e, i) => {
			// 각 페이지에 대해 roomUsers 배열을 순회하여 유저 ID별로 React.createRef() 생성
			const userRefs =
				roomUsers?.reduce((acc, user) => {
					acc[user.userId] = React.createRef();
					return acc;
				}, {}) || [];
			return { page: i + 1, userRefs: userRefs };
		});
		console.log("newRefs", newRefs);
		setInitialize(true);
		setBookChanged((prev) => !prev);
		setDrawingCanvasRefs(newRefs);
	}, [totalPage, roomUsers, initialize]);

	useEffect(() => {
		socket.on("canvasImage", (data) => {
			// data 객체에서 canvasId와 이미지 URL을 추출
			if (data) {
				const { userId, canvasImage, location } = data;
				// console.log("canvasImage event", data);
				const canvas = getCanvasRef(drawingCanvasRefs, location.pageNum, userId);
				console.log("canvas", canvas);
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
