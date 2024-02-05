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
import { Box, Grid } from "@mui/material";
import PenController from "./PenController";

function PDFViewer({ book }) {
	const [htmlContent, setHtmlContent] = useState("");
	const [renderContent, setRenderContent] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);
	const [scroll, setScroll] = useRecoilState(scrollYState);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [scale, setScale] = useState(1);

	const scrollerRef = useRef(null);
	const pdfContentsRef = useRef(null);

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
		if (htmlContent && scrollerRef.current) {
			console.log("htmlContent rerender");
			const pageContainer = scrollerRef.current.querySelector("#page-container");
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

	useEffect(() => {
		if (renderContent && pdfContentsRef) {
			setOriginalWidth(pdfContentsRef.current.getBoundingClientRect().width);
		}
	}, [renderContent, pdfContentsRef]);

	useEffect(() => {
		if (originalWidth) {
			adjustScaleToWidth(800);
		}
	}, [originalWidth]);

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

	function adjustScaleToWidth(targetWidth) {
		const scale = 0.65; //originalWidth / targetWidth;
		console.log(scale);
		setScale(scale);
	}

	return (
		<div>
			{/* <DrawingCanvas /> */}
			<AttentionButton scrollerRef={scrollerRef} />
			<Box className="pdf-chart-container">
				<Grid container>
					<Grid item style={{ flex: 1 }}>
						<Chart scroll={scroll} />
					</Grid>
					<Grid item style={{ flex: 4 }}>
						<PdfScroller scrollerRef={scrollerRef}>
							<Box
								ref={pdfContentsRef}
								className="pdf-contents"
								dangerouslySetInnerHTML={{ __html: htmlContent }}
								sx={{
									width: "100%",
									transform: `scale(${scale})`,
									transformOrigin: "top left",
									boxSizing: "border-box",
								}}
							/>
						</PdfScroller>
					</Grid>
					<Grid item style={{ flex: 1 }}>
						<PenController />
						<Highlights bookId={book.id} renderContent={renderContent} scrollerRef={scrollerRef} />
					</Grid>
				</Grid>
			</Box>
			{canvasComponents.map(({ component, container }) => {
				return createPortal(component, container);
			})}
			<CursorCanvasController totalPage={canvasComponents.length} />
		</div>
	);
}

export default PDFViewer;
