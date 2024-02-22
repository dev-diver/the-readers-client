import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlighter from "./Highlighter";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import PdfScroller from "./PdfScroller/index";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import DrawingCanvasController from "./PageCanvasGroup/DrawingCanvasController";
import { useRecoilState, useRecoilCallback } from "recoil";
import {
	viewerScaleState,
	htmlContentState,
	viewerScaleApplyState,
	bookState,
	pageLoadingStateFamily,
	renderContentState,
} from "recoil/atom";
import { Box, Grid, Hidden } from "@mui/material";
import PenController from "./PenController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";
// import ReactiveDraggable from "components/DragNDrop/ReactiveDraggable";
import api from "api";
import { baseURL } from "config/config";
import Info from "components/Header/Info";
import { styled } from "@mui/system";
import VideoChat from "components/VideoChat";
import "./styles.css";
import RoomUserList from "components/RoomUserList";
import { useParams } from "react-router-dom";

const VIEWER_WIDTH = 800; //650;

function PDFViewer() {
	const { bookId } = useParams();
	const [pageContainerHTML, setPageContainerHTML] = useRecoilState(htmlContentState);
	const [renderContent, setRenderContent] = useRecoilState(renderContentState);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [scaleApply, setScaleApply] = useRecoilState(viewerScaleApplyState);
	const [isHovering, setIsHovering] = useState(false);
	const [book, setBook] = useRecoilState(bookState);
	const [cssLinkId, setCssLinkId] = useState("");

	const pdfContentsRef = useRef(null);
	const dimensions = useResizeObserver(pdfContentsRef);

	const updatePageLoadingState = useRecoilCallback(
		({ set }) =>
			(bookId, pageNum, loadingState) => {
				// console.warn("viwer book", bookId, "page", pageNum, "set", loadingState);
				console.log("viwer book", bookId, "page", pageNum, "set", loadingState);
				set(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum }), loadingState);
			},
		[]
	);

	useEffect(() => {
		return () => {
			for (let page = 1; page <= book?.totalPage || 0; page++) {
				// console.warn("book reset", book);
				console.log("make book", book, ", page,", page, "loading false");
				updatePageLoadingState(book.id, page, false);
			}
			if (setPageContainerHTML || renderContent) {
				console.log("book reset");
				setScale(1);
				setScaleApply(false);
				setPageContainerHTML("");
				setRenderContent(false);
				setOriginalWidth(0);
			}
		};
	}, [book]);

	useEffect(() => {
		if (!book?.urlName || pageContainerHTML) {
			return;
		}
		//css는 href로 들어가서 써줘야함
		const CSSurl = `${baseURL}/api/storage/pdf/${book.urlName}/css`;
		const linkId = `css-${book.urlName}`;
		console.log("css url", linkId);
		setCssLinkId(linkId);
		const link = document.createElement("link");
		link.href = CSSurl;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.id = linkId;
		document.head.appendChild(link);
		console.log("css loaded", pageContainerHTML);

		const HTMLurl = `/storage/pdf/${book.urlName}`;
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
	}, [book, pageContainerHTML]);

	useEffect(() => {
		return () => {
			const link = document.getElementById(cssLinkId);
			console.log("want to remove css", cssLinkId, link);
			if (link) {
				console.log("css link removed");
				link.remove();
			}
		};
	}, [cssLinkId]);

	useEffect(() => {
		if (pageContainerHTML && !renderContent && book?.urlName && pdfContentsRef?.current) {
			console.log("htmlContent rerender");
			const pageContainer = pdfContentsRef.current.querySelector("#page-container");
			if (!pageContainer) return;
			const pageDivs = pageContainer.querySelectorAll(".pf"); //페이지 div
			mapContainer(pageDivs);
		}
	}, [book, pageContainerHTML, renderContent, pdfContentsRef]);

	useEffect(() => {
		if (renderContent && pdfContentsRef?.current && dimensions?.height > 30) {
			// console.warn("width renderContent", renderContent, dimensions);
			console.log("width renderContent", renderContent, dimensions);
			const wrapper = pdfContentsRef.current.querySelector(".page-wrapper");
			if (!wrapper) {
				console.info("wrapper not found");
				return;
			}
			const originalWidth = wrapper.getBoundingClientRect().width;
			setOriginalWidth(originalWidth);
		}
	}, [renderContent, pdfContentsRef, dimensions]);

	useEffect(() => {
		if (originalWidth) {
			adjustScaleToWidth(VIEWER_WIDTH);
		}
	}, [originalWidth]);

	function adjustScaleToWidth(targetWidth) {
		const scale = targetWidth / originalWidth;
		console.log("originalWidth", originalWidth, "targetWidth", targetWidth, "scale", scale);
		setScale(scale);
		setScaleApply(true);
	}

	async function mapContainer(pageDivs) {
		const mapCanvasContainer = await Promise.all(
			Array.from(pageDivs).map(async (pageDiv, index) => {
				const container = document.createElement("div");
				container.classList.add("page-wrapper");
				container.style.display = "inline-block"; //content에 크기 맞추기
				container.style.height = "auto";
				container.style.position = "relative";

				const canvasLayer = document.createElement("div");
				canvasLayer.classList.add("canvasLayer");
				canvasLayer.style.display = "inline-block";
				canvasLayer.style.height = "auto";

				const textLayer = document.createElement("div");
				textLayer.classList.add("textLayer"); //content에 크기 맞추기
				textLayer.style.display = "inline-block";
				textLayer.style.height = "auto";

				const pageDivClone = pageDiv.cloneNode(true);
				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(textLayer);
				container.appendChild(canvasLayer);
				textLayer.appendChild(pageDivClone);

				const url = `/homeIcon.svg`;
				fetch(url)
					.then((response) => response.text())
					.then((svgData) => {
						pageDivClone.innerHTML = svgData;

						updatePageLoadingState(bookId, index + 1, "lazy-loading");
					})
					.catch((error) => console.error("SVG 못 가져옴", error));

				return {
					component: <PageCanvasGroup pageNum={index + 1} canvasFrame={textLayer} book={book} />,
					container: canvasLayer,
				};
			})
		);
		setCanvasComponents(mapCanvasContainer);
		console.log("renderContent true");
		setRenderContent(true);
	}

	return (
		<div className="pdf-viewer" style={{ display: "flex", justifyContent: "center" }}>
			<Box
				sx={{
					display: "flex",
					position: "relative",
					boxShadow: "0px 4px 6px rgba(33, 33, 33, 0.1)",
					width: "100%", // 전체 너비를 차지하도록 설정
				}}
			>
				<Box
					sx={{
						flex: 2,
						backgroundColor: "#e1c69e",
						padding: 0,
						margin: 0,
						minWidth: "100px",
					}}
				>
					<Chart />
				</Box>

				<Box
					sx={{
						flex: 8,
						backgroundColor: "#e1c69e",
						paddingLeft: 0,
						minWidth: "800px", // 최소 너비 설정
					}}
				>
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
				</Box>
				<Box sx={{ flex: 0.5, position: "relative" }}>
					<Info />
				</Box>
				<Box sx={{ flex: 3.5 }}>
					<Highlighter bookId={bookId} renderContent={renderContent} />
				</Box>
			</Box>
			{/* <RoomUserList /> */}
			{canvasComponents.map(({ component, container }) => {
				return component && createPortal(component, container);
			})}
			<DraggableElement startX={window.innerWidth * (8 / 9)} startY={60} style={{ zIndex: 999 }}>
				<VideoChat />
			</DraggableElement>
			<DraggableElement startX={window.innerWidth / 2 - 150} startY={20}>
				<PenController />
			</DraggableElement>
			<CursorCanvasController totalPage={canvasComponents.length} />
			<DrawingCanvasController totalPage={canvasComponents.length} />
		</div>
	);
}

const useResizeObserver = (ref) => {
	const [dimensions, setDimensions] = useState(null);

	useEffect(() => {
		const observeTarget = ref.current;
		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach((entry) => {
				setDimensions(entry.contentRect);
			});
		});

		if (observeTarget) {
			resizeObserver.observe(observeTarget);
		}

		return () => {
			if (observeTarget) {
				resizeObserver.unobserve(observeTarget);
			}
		};
	}, [ref]);

	return dimensions;
};

export default PDFViewer;
