import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "socket.js";
import api from "api";
import { logger } from "logger";
import Button from "components/Button";
import Highlights from "./Highlights";
import PageCanvas from "./PageCanvas";
import Chart from "components/Chart";
import DrawingCanvas from "components/DrawingCanvas";
import { debounce } from "lodash";
import "./styles.css";
// import { log } from "console";

function PDFViewer({ bookId, roomId }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [isAttention, setAttention] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);
	const [scroll, setScroll] = useState(calculateScrollY());

	const containerRef = useRef(null);

	const moveToScroll = (scrollTop) => {
		logger.log("moveto", scrollTop);
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
		logger.log(`스크롤 위치 : ${scrollTop}`);
		socket.emit("attention_scroll", {
			cleintID: 1,
			scrollTop: scrollTop,
		});
		setAttention(false);
	}, []);

	useEffect(() => {
		logger.log("책 id", bookId);
		api
			.get(`/books/${bookId}`)
			.then((response) => {
				const bookUrl = response.data.data.url;
				logger.log(bookUrl);
				return fetch(bookUrl)
					.then((response) => {
						return response.text();
					})
					.catch((err) => {
						logger.log(err);
					});
			})
			.then((data) => {
				logger.log(data);
				setHtmlContent(data);
			});
	}, []);

	// canvasComponents
	useEffect(() => {
		if (htmlContent && containerRef.current) {
			const pageContainer = containerRef.current.querySelector("#page-container");
			const pageDivs = pageContainer.querySelectorAll("div");
			const mapCanvasContainer = Array.from(pageDivs).map((pageDiv, index) => {
				const container = document.createElement("div");
				container.classList.add("page-wrapper");

				const canvasLayer = document.createElement("div");
				canvasLayer.classList.add("canvasLayer");

				const textLayer = document.createElement("div");
				textLayer.classList.add("textLayer");

				const pageRect = pageDiv.getBoundingClientRect();
				const pageDivClone = pageDiv.cloneNode(true);
				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(canvasLayer);
				container.appendChild(textLayer);
				textLayer.appendChild(pageDivClone);

				logger.log("pageRect", pageRect);
				return {
					component: <PageCanvas pageNum={index} pageRect={pageRect} />,
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
			<DrawingCanvas />
			<Button onClick={() => sendAttention()} />
			<Highlights />
			<div className="pdf-chart-container" style={{ display: "flex", margin: "0 auto", width: "1000px" }}>
				<Chart scroll={scroll} />
				<div className="pdf-container" ref={containerRef}>
					<div className="pdf-contents" dangerouslySetInnerHTML={{ __html: htmlContent }} />
				</div>
			</div>
			{canvasComponents.map(({ component, container }, index) => {
				return createPortal(component, container);
			})}
		</>
	);
}

export default PDFViewer;
