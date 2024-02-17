import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlights from "./Highlights";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import PdfScroller from "./PdfScroller/index";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import DrawingCanvasController from "./PageCanvasGroup/DrawingCanvasController";
import { useRecoilState } from "recoil";
import { drawerFormState, userState, viewerScaleState, htmlContentState, eachPageLoadingState } from "recoil/atom";
import { Box, Grid, Hidden } from "@mui/material";
import PenController from "./PenController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";
// import { ReactiveDraggable } from "components/DragNDrop/ReactiveDraggable";
import api from "api";
import { baseURL } from "config/config";
import { produce } from "immer";
import Info from "components/Header/Info";
import { styled } from "@mui/system";
import "./styles.css";
import RoomUserList from "components/RoomUserList";

const VIEWER_WIDTH = 800; //650;

const CustomSidebar = styled(Box)(({ theme }) => ({
	width: "100%",
	height: "100%",
	overflow: "hidden",
	transition: "transform .5s ease",
	transform: "translateX(-100%)", // 기본적으로 숨김
	"&:hover": {
		transform: "translateX(0%)", // 마우스 오버 시 나타남
	},
	[theme.breakpoints.up("sm")]: {
		transform: "translateX(0%)", // 화면이 sm 이상일 때는 항상 나타남
	},
}));

function PDFViewer({ book }) {
	const [pageContainerHTML, setPageContainerHTML] = useRecoilState(htmlContentState);
	const [renderContent, setRenderContent] = useState(false);
	const [canvasComponents, setCanvasComponents] = useState([]);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const pdfContentsRef = useRef(null);
	const [eachPageLoading, setEachPageLoading] = useRecoilState(eachPageLoadingState);
	const [isHovering, setIsHovering] = useState(false);

	useEffect(() => {
		setRenderContent(false);
		if (!book?.urlName) {
			return;
		}
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

		const CSSurl = `${baseURL}/api/storage/pdf/${book.urlName}/css`;
		const linkId = `css-${book.urlName}`;

		const link = document.createElement("link");
		link.href = CSSurl;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.id = linkId;
		document.head.appendChild(link);

		setEachPageLoading([]);

		return () => {
			const link = document.getElementById(linkId);
			if (link) {
				link.remove();
			}
			setEachPageLoading([]);
		};
	}, [book]);

	useEffect(() => {
		if (pageContainerHTML && !renderContent && book?.urlName) {
			console.log("htmlContent rerender");
			const pageContainer = pdfContentsRef.current.querySelector("#page-container");
			if (!pageContainer) return;
			const pageDivs = pageContainer.querySelectorAll(".pf"); //페이지 div
			setEachPageLoading(new Array(pageDivs.length).fill(false));
			mapContainer(pageDivs);
		}
	}, [pageContainerHTML, book]);

	useEffect(() => {
		if (renderContent && pdfContentsRef) {
			const wrapper = pdfContentsRef.current.querySelector(".page-wrapper");
			const originalWidth = wrapper.getBoundingClientRect().width;
			setOriginalWidth(originalWidth);
		}
	}, [renderContent, pdfContentsRef]);

	useEffect(() => {
		if (originalWidth) {
			adjustScaleToWidth(VIEWER_WIDTH);
		}
	}, [originalWidth]);

	function adjustScaleToWidth(targetWidth) {
		const scale = targetWidth / originalWidth;
		console.log("originalWidth", originalWidth, "targetWidth", targetWidth, "scale", scale);
		setScale(scale);
	}

	async function mapContainer(pageDivs) {
		const mapCanvasContainer = await Promise.all(
			Array.from(pageDivs).map(async (pageDiv, index) => {
				const fileName = pageDiv.getAttribute("data-page-url");
				console.log(fileName, "fileName", eachPageLoading[index]);
				if (!fileName || !pageDiv.parentNode || eachPageLoading[index])
					return {
						component: null,
						container: null,
					};
				setEachPageLoading((prev) =>
					produce(prev, (draft) => {
						draft[index] = "loading";
					})
				);
				const url = `/storage/pdf/${book.urlName}/pages/${fileName}`;
				const pageDivLoad = await api(url)
					.then((response) => {
						const parser = new DOMParser();
						const doc = parser.parseFromString(response.data, "text/html");
						const div = doc.querySelector(".pf");
						return div;
					})
					.catch((err) => {
						logger.log(err);
					});
				// console.log(pageDivLoad, "pageDivLoad");

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

				// textLayer.addEventListener("mousemove", (e) => canvasMouse(e, index));
				// textLayer.addEventListener("mouseout", (e) => clearCanvas(index));
				pageDiv.parentNode.replaceChild(container, pageDiv);
				container.appendChild(textLayer);
				container.appendChild(canvasLayer);
				textLayer.appendChild(pageDivLoad);
				setEachPageLoading((prev) =>
					produce(prev, (draft) => {
						draft[index] = "loaded";
					})
				);
				return {
					component: <PageCanvasGroup pageNum={index + 1} canvasFrame={textLayer} />,
					container: canvasLayer,
				};
			})
		);
		setCanvasComponents(mapCanvasContainer);
		setRenderContent(true);
	}

	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
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
					<Highlights bookId={book.id} renderContent={renderContent} />
				</Box>
			</Box>

			{canvasComponents.map(({ component, container }) => {
				return component && createPortal(component, container);
			})}
			<DraggableElement startX={window.innerWidth / 2} startY={60}>
				<PenController />
			</DraggableElement>
			<CursorCanvasController totalPage={canvasComponents.length} />
			{/* <DrawingCanvasController totalPage={canvasComponents.length} /> undo redo*/}
		</div>
	);
}

export default PDFViewer;
