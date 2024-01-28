import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "socket.js";
import api from "api";
import { logger } from "logger";
import Button from "components/Button";
import Highlights from "./Highlights";
import PageCanvas from "./PageCanvas";

function PDFViewer({ bookId, roomId }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [isAttention, setAttention] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);

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

	return (
		<>
			<Button onClick={() => sendAttention()} />
			<Highlights />
			<div className="pdf-container" onScroll={handleScroll} ref={containerRef}>
				<div className="pdf-contents" dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</div>
			{canvasComponents.map(({ component, container }, index) => {
				return createPortal(component, container);
			})}
		</>
	);
}

export default PDFViewer;
