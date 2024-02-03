import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "socket.js";
import { logger } from "logger";
import Button from "components/Buttons/FocusButton";
import Highlights from "./Highlights";
import PageCanvas from "./PageCanvas";
import Chart from "components/Chart";
import DrawingCanvas from "components/DrawingCanvas";
import { debounce } from "lodash";
import "./styles.css";
import VideoRoom from "pages/VideoRoom";
// import { log } from "console";

function PDFViewer({ book }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [renderContent, setRenderContent] = useState(false);
	const [isAttention, setAttention] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);
	const [scroll, setScroll] = useState(calculateScrollY());

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
						console.log("text", text);
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
			// console.log("updatepointer", data);
			redrawCanvas(data.page);
			// redrawCanvas(1);
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

		// console.log(`pagenum ${pageNum} x: ${offsetX}, y: ${offsetY}`);
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
			setRenderContent(true);
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

	useEffect(() => {
		const pageContainer = document.getElementsByClassName("pdf-container")[0];
		if (!pageContainer) return;

		// 스크롤 이벤트 리스너 추가
		pageContainer.addEventListener("scroll", () => handleContainerScroll());
		// 컴포넌트가 언마운트될 때 리스너 제거
		return () => pageContainer.removeEventListener("scroll", () => handleContainerScroll());
	}, []);

	const handleContainerScroll = debounce(() => {
		// logger.log("debounce", scroll);
		// setPrevScroll(scroll);
		setScroll(calculateScrollY());
	}, 1000);

	function calculateScrollY() {
		const pageContainer = document.getElementsByClassName("pdf-container")[0];
		if (!pageContainer) {
			return 0;
		}

		const scrollY = pageContainer.scrollTop;
		// logger.log("scrollY", scrollY);
		const containerHeight = pageContainer.scrollHeight;
		// logger.log("containerHeight", containerHeight);
		const clientHeight = pageContainer.clientHeight;
		// logger.log("clientHeight", clientHeight);
		const totalScrollableHeight = containerHeight - clientHeight;
		// logger.log("totalScrollableHeight", totalScrollableHeight);
		// (스크롤 위치 / 전체 스크롤 가능한 길이) * 10 = (전체 길이상대적인 스크롤 위치)
		return Math.round((scrollY / totalScrollableHeight) * 30);
	}

	return (
		<>
			<VideoRoom />
			<DrawingCanvas />
			<Button onClick={() => sendAttention()} />
			<div className="pdf-chart-container" style={{ display: "flex", margin: "0 auto", width: "1000px" }}>
				<Chart scroll={scroll} />
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
			</div>
			{canvasComponents.map(({ component, container }) => {
				return createPortal(component, container);
			})}
			<Highlights bookId={book.id} renderContent={renderContent} />
		</>
	);
}

export default PDFViewer;
