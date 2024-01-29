import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "socket.js";
import { logger } from "logger";
import Button from "components/Button";
import Highlights from "./Highlights";
import PageCanvas from "./PageCanvas";
import Chart from "components/Chart";

function PDFViewer({ book }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [isAttention, setAttention] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);

	const canvasRef = useRef([]);
	const pointers = useRef([]);

	const containerRef = useRef(null);

	const moveToScroll = (scrollTop) => {
		containerRef.current.scrollTop = scrollTop;
	};

	const sendAttention = () => {
		socket.emit("attention", {
			attention: true,
			scrollTop: containerRef.current.scrollTop,
		});
	};

	const handleScroll = useCallback((event) => {
		const scrollTop = event.currentTarget.scrollTop;
		socket.emit("attention_scroll", {
			cleintID: 1,
			scrollTop: scrollTop,
		});
		setAttention(false);
	}, []);

	useEffect(() => {
		book.url &&
			fetch(book.url)
				.then((response) => {
					response.text().then((text) => {
						setHtmlContent(text);
					});
				})
				.catch((err) => {
					logger.log(err);
				});
	}, [book.url]);

	useEffect(() => {
		socket.on("updatepointer", (data) => {
			updatePointers(data);
			redrawCanvas(data.page);
		});
		return () => {
			socket.off("updatepointer");
		};
	}, []);

	const updatePointers = (data) => {
		// 새로운 포인터 데이터 추가 또는 업데이트
		const index = pointers.current.findIndex((p) => p.id === data.id);
		if (index >= 0) {
			pointers.current[index] = data;
		} else {
			pointers.current.push(data);
		}
	};

	const redrawCanvas = (pageNum) => {
		clearCanvas(pageNum);
		pointers.current.forEach((p) => {
			drawOnCanvas(pageNum, p.x, p.y, p.color);
		});
	};

	const canvasMouse = (event, pageNum) => {
		event.stopPropagation();
		let offsetX = event.offsetX;
		let offsetY = event.offsetY;

		let element = event.target;
		while (element && event.currentTarget.contains(element) && element !== event.currentTarget) {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
			element = element.offsetParent;
		}

		console.log(`pagenum ${pageNum} x: ${offsetX}, y: ${offsetY}`);
		socket.emit("movepointer", { page: pageNum, x: offsetX, y: offsetY });
	};

	const clearCanvas = (pageNum) => {
		const canvas = canvasRef.current[pageNum];
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	function drawOnCanvas(pageNum, x, y, color) {
		const ctx = canvasRef.current[pageNum].getContext("2d");
		ctx.fillStyle = color; // 서버로부터 받은 색상 사용
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, Math.PI * 2, false);
		ctx.fill(); // 텍스트 그리기
	}

	useEffect(() => {
		if (htmlContent && containerRef.current) {
			console.log("htmlContent rerender");
			const pageContainer = containerRef.current.querySelector("#page-container");
			const pageDivs = pageContainer.querySelectorAll(":scope > div");
			const mapCanvasContainer = Array.from(pageDivs).map((pageDiv, index) => {
				const container = document.createElement("div");
				container.classList.add("page-wrapper");
				container.style.display = "inline-block"; //content에 크기 맞추기
				container.style.height = "auto";
				container.style.position = "relative";

				const canvasLayer = document.createElement("div");
				canvasLayer.classList.add("canvasLayer");

				const textLayer = document.createElement("div");
				textLayer.classList.add("textLayer"); //content애 크기 맞추기
				textLayer.style.display = "inline-block";
				textLayer.style.height = "auto";
				textLayer.addEventListener("mousemove", (e) => canvasMouse(e, index));
				textLayer.addEventListener("mouseout", (e) => clearCanvas(index));

				const pageDivClone = pageDiv.cloneNode(true);

				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(canvasLayer);
				container.appendChild(textLayer);
				textLayer.appendChild(pageDivClone);

				return {
					component: <PageCanvas canvasRef={canvasRef} pageNum={index} pageWrapper={container} />,
					container: canvasLayer,
				};
			});

			setCanvasComponents(mapCanvasContainer);
		}
	}, [htmlContent]);

	// useEffect(() => {
	//     const link = document.createElement('link');
	//     link.rel = "stylesheet"
	//     link.href = `${baseURL}/src/example.css`
	//     link.onload = () => setCssLoaded(true);
	//     document.head.appendChild(link);

	//     return() =>{
	//         document.head.removeChild(link);
	//     }
	// }, []);

	useEffect(() => {
		socket.on("attention", (data) => {
			setAttention(data.attention);
			moveToScroll(data.scrollTop);
		});

		return () => {
			socket.off("attention");
			socket.off("attention_scroll");
		};
	}, []);

	useEffect(() => {
		if (isAttention) {
			socket.on("attention_scroll", (data) => {
				moveToScroll(data.scrollTop);
			});
		} else {
			socket.off("attention_scroll");
		}
	}, [isAttention]);

	return (
		<>
			<Button onClick={() => sendAttention()} />
			<Chart pageContainer={containerRef.current} />
			<Highlights />
			<div
				className="pdf-container"
				onScroll={handleScroll}
				ref={containerRef}
				style={{
					height: "80vh",
					width: "55%",
					overflow: "scroll",
				}}
			>
				<div
					className="pdf-contents"
					dangerouslySetInnerHTML={{ __html: htmlContent }}
					style={{ width: "100%", height: "100%" }}
				/>
			</div>
			{canvasComponents.map(({ component, container }) => {
				return createPortal(component, container);
			})}
		</>
	);
}

export default PDFViewer;
