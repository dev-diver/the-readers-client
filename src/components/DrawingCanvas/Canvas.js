import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import api from "api";
import socket from "socket.js";

const generator = rough.generator();
const Canvas = ({ canvasRef, ctx, color, setElements, elements, tool }) => {
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.height = window.innerHeight * 2;
		canvas.width = window.innerWidth * 2;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		const context = canvas.getContext("2d");

		context.strokeWidth = 5;
		context.scale(2, 2);
		context.lineCap = "round";
		context.strokeStyle = color;
		context.lineWidth = 5;
		ctx.current = context;
	}, []);

	useEffect(() => {
		ctx.current.strokeStyle = color;
	}, [color]);

	const handleMouseDown = (e) => {
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

	useLayoutEffect(() => {
		const roughCanvas = rough.canvas(canvasRef.current);
		if (elements.length > 0) {
			ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
		const canvasImage = canvasRef.current.toDataURL();
		socket.emit("drawing", canvasImage);
	}, [elements]);

	const handleMouseMove = (e) => {
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
	const handleMouseUp = () => {
		setIsDrawing(false);
	};

	const saveCanvas = () => {
		const canvasImage = canvasRef.current.toDataURL("image/png");
		// canvasImage를 '../uploads'로 png로 저장해서 전송하기
		// 데이터 URL을 Blob으로 변환
		fetch(canvasImage)
			.then((res) => res.blob())
			.then((blob) => {
				const formData = new FormData();
				formData.append("file", blob, "canvasImage.png");
				// 서버로 전송
				console.log("formData", formData);
				api.post("/storage/drawings", formData);
			})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error("Error:", error));
	};

	return (
		<div>
			<div
				className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
				style={{ height: "100px" }}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				<canvas ref={canvasRef} />
			</div>
		</div>
	);
};

export default Canvas;
