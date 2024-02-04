import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlights from "./Highlights";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import DrawingCanvas from "components/DrawingCanvas";
import PdfScroller from "./PdfScroller/index";
import AttentionButton from "./PdfScroller/AttentionButton";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import { useRecoilState } from "recoil";
import { scrollYState, isTrailState } from "recoil/atom";

import "./styles.css";

function PDFViewer({ book }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [renderContent, setRenderContent] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);
	const [scroll, setScroll] = useRecoilState(scrollYState);

	const containerRef = useRef(null);

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
				// textLayer.addEventListener("mousemove", (e) => canvasMouse(e, index));
				// textLayer.addEventListener("mouseout", (e) => clearCanvas(index));

				const pageDivClone = pageDiv.cloneNode(true);

				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(canvasLayer);
				container.appendChild(textLayer);
				textLayer.appendChild(pageDivClone);

				return {
					component: <PageCanvasGroup pageNum={index + 1} pageWrapper={container} />,
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

	return (
		<>
			<DrawingCanvas />
			<AttentionButton containerRef={containerRef} />
			<div className="pdf-chart-container" style={{ display: "flex", margin: "0 auto", width: "1000px" }}>
				<Chart scroll={scroll} />
				<PdfScroller containerRef={containerRef}>
					<div
						className="pdf-contents"
						dangerouslySetInnerHTML={{ __html: htmlContent }}
						style={{ width: "100%", height: "100%" }}
					/>
				</PdfScroller>
			</div>
			{canvasComponents.map(({ component, container }) => {
				return createPortal(component, container);
			})}
			<Highlights bookId={book.id} renderContent={renderContent} containerRef={containerRef} />
			<CursorCanvasController totalPage={canvasComponents.length} />
		</>
	);
}

export default PDFViewer;
