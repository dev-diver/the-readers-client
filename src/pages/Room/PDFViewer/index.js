import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlights from "./Highlights";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import VideoChat from "components/VideoChat";
import PdfScroller from "./PdfScroller/index";
import AttentionButton from "./PdfScroller/AttentionButton";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import { useRecoilState } from "recoil";
import { scrollYState, scrollerRefState, viewerScaleState } from "recoil/atom";
import { Box, Grid } from "@mui/material";
import PenController from "./PenController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";

const VIEWER_WIDTH = 800;

function PDFViewer({ book }) {
	const notesData = [
		{
			id: "1",
			content: "",
			position: {
				x: 550,
				y: 100,
			},
		},
	];
	const [htmlContent, setHtmlContent] = useState("");
	const [renderContent, setRenderContent] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [cssLoaded, setCssLoaded] = useState(false);
	const [scroll, setScroll] = useRecoilState(scrollYState);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [notes, setNotes] = useState(notesData);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);

	const pdfContentsRef = useRef(null);

	useEffect(() => {
		setRenderContent(false);
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
		if (htmlContent && scrollerRef) {
			console.log("htmlContent rerender");
			const pageContainer = scrollerRef.querySelector("#page-container");
			if (!pageContainer) return;
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
			adjustScaleToWidth(VIEWER_WIDTH);
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
		setScale(scale);
	}

	return (
		<div>
			<VideoChat />
			{/* <DrawingCanvas /> */}
			<AttentionButton />
			<Box className="pdf-chart-container">
				<Grid container>
					<Grid item style={{ flex: 1 }}>
						<Chart scroll={scroll} />
					</Grid>
					<Grid item style={{ flex: 4 }}>
						<PdfScroller renderContent={renderContent}>
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
					{notes.map((note) => (
						<Grid item style={{ flex: 1 }} key={note.id}>
							<DraggableElement>
								<PenController />
							</DraggableElement>
							<Highlights bookId={book.id} renderContent={renderContent} />
						</Grid>
					))}
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
