import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlights from "./Highlights";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import VideoChat from "components/VideoChat";
import PdfScroller from "./PdfScroller/index";
import AttentionButton from "./PenController/AttentionButton";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import DrawingCanvasController from "./PageCanvasGroup/DrawingCanvasController";
import { useRecoilState } from "recoil";
import { scrollYState, scrollerRefState, viewerScaleState, htmlContentState } from "recoil/atom";
import { Box, Button, Grid, Hidden } from "@mui/material";
import PenController from "./PenController";
import SwitchController from "./SwitchController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";
import RoomUserList from "components/RoomUserList";
import api from "api";
import { baseURL } from "config/config";

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
	const [pageContainerHTML, setPageContainerHTML] = useRecoilState(htmlContentState);
	const [renderContent, setRenderContent] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [notes, setNotes] = useState(notesData);
	const pdfContentsRef = useRef(null);

	useEffect(() => {
		setRenderContent(false);
		if (!book?.urlName) {
			return;
		}
		const HTMLurl = `/storage/pdfs/${book.urlName}`;
		api(HTMLurl)
			.then((response) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(response.data, "text/html");
				const pageContainer = doc.querySelector("#page-container");
				const htmlContent = pageContainer ? pageContainer.outerHTML : "";
				setPageContainerHTML(htmlContent);
			})
			.catch((err) => {
				logger.log(err);
			});

		const CSSurl = `${baseURL}/api/storage/pdfCss/${book.urlName}`;
		const linkId = `css-${book.urlName}`;

		const link = document.createElement("link");
		link.href = CSSurl;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.id = linkId;
		document.head.appendChild(link);

		return () => {
			const link = document.getElementById(linkId);
			if (link) {
				link.remove();
			}
		};
	}, [book]);

	useEffect(() => {
		if (pageContainerHTML && !renderContent) {
			console.log("htmlContent rerender");
			const pageContainer = pdfContentsRef.current.querySelector("#page-container");
			if (!pageContainer) return;
			mapContainer(pageContainer);
		}
	}, [pageContainerHTML]);

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

	function adjustScaleToWidth(targetWidth) {
		const scale = originalWidth / targetWidth;
		setScale(scale);
	}

	async function mapContainer(pageContainer) {
		const pageDivs = pageContainer.querySelectorAll(".pf"); //페이지 div
		const mapCanvasContainer = await Promise.all(
			Array.from(pageDivs).map(async (pageDiv, index) => {
				const fileName = pageDiv.getAttribute("data-page-url");
				console.log(fileName, "fileName");
				const url = `/storage/pdfPages/${book.urlName}/pages/${fileName}`;
				const pageDivLoad = await api(url).then((response) => {
					const parser = new DOMParser();
					const doc = parser.parseFromString(response.data, "text/html");
					const div = doc.querySelector(".pf");
					return div;
				});
				console.log(pageDivLoad, "pageDivLoad");

				const container = document.createElement("div");
				container.classList.add("page-wrapper");
				container.style.display = "inline-block"; //content에 크기 맞추기
				container.style.height = "auto";
				container.style.position = "relative";

				const canvasLayer = document.createElement("div");
				canvasLayer.classList.add("canvasLayer");

				const textLayer = document.createElement("div");
				textLayer.classList.add("textLayer"); //content에 크기 맞추기
				textLayer.style.display = "inline-block";
				textLayer.style.height = "auto";
				// textLayer.addEventListener("mousemove", (e) => canvasMouse(e, index));
				// textLayer.addEventListener("mouseout", (e) => clearCanvas(index));

				const pageDivClone = pageDiv.cloneNode(true);

				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(canvasLayer);
				container.appendChild(textLayer);
				textLayer.appendChild(pageDivLoad);

				return {
					component: <PageCanvasGroup pageNum={index + 1} pageWrapper={container} />,
					container: canvasLayer,
				};
			})
		);
		setCanvasComponents(mapCanvasContainer);
		setRenderContent(true);
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "flex-start",
				minHeight: "100vh",
				paddingTop: 25,
			}}
		>
			{/* <VideoChat /> */}
			{/* <DrawingCanvas /> */}
			<Grid container spacing={2}>
				<Hidden mdDown>
					<Grid item xs={false} sm={false} md={1.5} lg={2}>
						<Chart />
					</Grid>
				</Hidden>
				<Grid item xs={7} sm={7} md={7} lg={7}>
					<PdfScroller renderContent={renderContent}>
						<Box
							ref={pdfContentsRef}
							className="pdf-contents"
							dangerouslySetInnerHTML={{ __html: pageContainerHTML }}
							sx={{
								width: "100%",
								transform: `scale(${scale})`,
								transformOrigin: "top left",
								boxSizing: "border-box",
							}}
						/>
					</PdfScroller>
				</Grid>
				<Hidden smDown>
					<Grid item xs={false} sm={false} md={1} lg={3}>
						<RoomUserList />
						<Highlights bookId={book.id} renderContent={renderContent} />
					</Grid>
				</Hidden>
				{notes.map((note) => (
					<Grid item style={{ flex: 1 }} key={note.id}>
						<DraggableElement>
							<SwitchController />
						</DraggableElement>
						<DraggableElement>
							<PenController />
						</DraggableElement>
					</Grid>
				))}
			</Grid>
			{canvasComponents.map(({ component, container }) => {
				return createPortal(component, container);
			})}
			<CursorCanvasController totalPage={canvasComponents.length} />
			<DrawingCanvasController totalPage={canvasComponents.length} />
		</div>
	);
}

export default PDFViewer;
