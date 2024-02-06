import React, { useEffect, useRef, useState } from "react";
import socket from "socket.js";
import Canvas from "./Canvas";

const ClientRoom = ({ canvasId, users, setUsers, setUserNo }) => {
	const canvasRef = useRef(null);
	const ctx = useRef(null);
	const [color, setColor] = useState("#000000");
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);
	const [tool, setTool] = useState("pencil");

	useEffect(() => {
		socket.on("canvasImage", (data) => {
			// data 객체에서 canvasId와 이미지 URL을 추출
			if (data) {
				const { canvasId, canvasImage } = data;
				// 해당 canvasId를 가진 canvas 요소 찾기
				const canvas = document.getElementById(canvasId);
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
	}, []);

	return (
		<div>
			<div className="row mt-5">
				<Canvas
					canvasRef={canvasRef}
					canvasId={canvasId}
					ctx={ctx}
					color={color}
					setElements={setElements}
					elements={elements}
					tool={tool}
				/>
			</div>
		</div>
	);
};

export default ClientRoom;
