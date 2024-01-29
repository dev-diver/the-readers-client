import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "socket.js";
import { logger } from "logger";
import Button from "components/Buttons/FocusButton";
import Highlights from "./Highlights";
import PageCanvas from "./PageCanvas";
import Chart from "components/Chart";

function PDFViewer({ book }) {
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
		console.log("url", book.url);
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
		if (htmlContent && containerRef.current) {
			const pageContainer = containerRef.current.querySelector("#page-container");
			const pageDivs = pageContainer.querySelectorAll(":scope > div");
			const mapCanvasContainer = Array.from(pageDivs).map((pageDiv, index) => {
				const container = document.createElement("div");
				container.classList.add("page-wrapper");
				container.style.position = "relative";

				const canvasLayer = document.createElement("div");
				canvasLayer.classList.add("canvasLayer");

				const textLayer = document.createElement("div");
				textLayer.classList.add("textLayer");

				const pageDivClone = pageDiv.cloneNode(true);
				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(canvasLayer);
				container.appendChild(textLayer);
				textLayer.appendChild(pageDivClone);

				const containerRect = container.getBoundingClientRect();

				return {
					component: <PageCanvas pageNum={index} containerRect={containerRect} pageWrapper={container} />,
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
					width: "50%",
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
