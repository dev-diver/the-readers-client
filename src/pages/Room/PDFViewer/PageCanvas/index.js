import React, { useEffect, useRef } from "react";
import socket from "socket.js";

function PageCanvas({ pageNum, containerRect, pageWrapper }) {
	const canvas = useRef(null);
	const pointers = useRef([]);
	const [pageRect, setPageRect] = React.useState({});

	useEffect(() => {
		socket.on("updatepointer", (data) => {
			updatePointers(data);
			redrawCanvas();
		});
		return () => {
			socket.off("updatepointer");
		};
	}, []);

	useEffect(() => {
		if (pageWrapper) {
			console.log("pageWrapper", pageWrapper);
			const rect = pageWrapper.getBoundingClientRect();
			const newRect = {
				left: rect.left - containerRect.left,
				top: rect.top - containerRect.top,
				width: containerRect.width,
				height: containerRect.height,
			};

			setPageRect(newRect);
		}
	}, [pageWrapper]);

	const updatePointers = (data) => {
		// 새로운 포인터 데이터 추가 또는 업데이트
		const index = pointers.current.findIndex((p) => p.id === data.id);
		if (index >= 0) {
			pointers.current[index] = data;
		} else {
			pointers.current.push(data);
		}
	};

	const clearCanvas = () => {
		const ctx = canvas.current.getContext("2d");
		ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
	};

	const redrawCanvas = () => {
		clearCanvas();
		pointers.current.forEach((p) => {
			drawOnCanvas(p.x, p.y, p.color);
		});
	};

	function drawOnCanvas(x, y, color) {
		const ctx = canvas.current.getContext("2d");
		ctx.fillStyle = color; // 서버로부터 받은 색상 사용
		ctx.font = "20px Arial";
		ctx.fillText("여기", x, y); // 텍스트 그리기
	}

	const canvasMouse = (event) => {
		const rect = canvas.current.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		console.log("event", event.clientX, event.clientY);
		console.log("canvasMouse", x, y);
		socket.emit("movepointer", { page: pageNum, x: x, y: y });
	};

	return (
		<canvas
			ref={canvas}
			width={pageRect.width}
			height={pageRect.height}
			onMouseMove={(e) => canvasMouse(e)}
			style={{
				border: "1px solid black",
				// pointerEvents: "none",
				position: "absolute",
				// width: `${pageRect.width}px`,
				// height: `${pageRect.height}px`,
				left: `${pageRect.left}px`,
				top: `${pageRect.top}px`,
			}}
		></canvas>
	);
}

export default PageCanvas;
