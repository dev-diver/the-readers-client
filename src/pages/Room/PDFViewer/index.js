import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { logger } from "logger";
import Highlights from "./Highlights";
import PageCanvasGroup from "./PageCanvasGroup";
import Chart from "components/Chart";
import PdfScroller from "./PdfScroller/index";
import CursorCanvasController from "./PageCanvasGroup/CursorCanvasController";
import DrawingCanvasController from "./PageCanvasGroup/DrawingCanvasController";
import { useRecoilState, useRecoilCallback } from "recoil";
import { totalPageState, viewerScaleState, htmlContentState, pageLoadingStateFamily } from "recoil/atom";
import { Box, Grid, Hidden } from "@mui/material";
import PenController from "./PenController";
import { DraggableElement } from "components/DragNDrop/DraggableElement";
// import { ReactiveDraggable } from "components/DragNDrop/ReactiveDraggable";
import api from "api";
import { baseURL } from "config/config";
import RoomUserList from "components/RoomUserList";
import Info from "components/Header/Info";
import { styled } from "@mui/system";

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
	const [isHovering, setIsHovering] = useState(false);
	const [totalPage, setTotalPage] = useRecoilState(totalPageState);

	const updatePageLoadingState = useRecoilCallback(
		({ set }) =>
			(pageNum, loadingState) => {
				set(pageLoadingStateFamily({ pageNum: pageNum }), loadingState);
			},
		[]
	);

	useEffect(() => {
		setRenderContent(false);
		if (!book?.urlName) {
			return;
		}

		//css는 href로 들어가서 써줘야함
		const CSSurl = `${baseURL}/api/storage/pdf/${book.urlName}/css`;
		const linkId = `css-${book.urlName}`;

		const link = document.createElement("link");
		link.href = CSSurl;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.id = linkId;
		document.head.appendChild(link);
		console.log("css loaded");

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

		return () => {
			const link = document.getElementById(linkId);
			if (link) {
				link.remove();
			}
			setTotalPage(0);
		};
	}, [book]);

	useEffect(() => {
		if (pageContainerHTML && !renderContent && book?.urlName) {
			console.log("htmlContent rerender");
			const pageContainer = pdfContentsRef.current.querySelector("#page-container");
			if (!pageContainer) return;
			const pageDivs = pageContainer.querySelectorAll(".pf"); //페이지 div
			setTotalPage(pageDivs.length);
			mapContainer(pageDivs);
		}
	}, [pageContainerHTML, book]);

	useEffect(() => {
		if (totalPage === 0) return;
		for (let page = 1; page <= totalPage; page++) {
			updatePageLoadingState(page, false);
		}
	}, [book, totalPage]);

	useEffect(() => {
		if (renderContent && pdfContentsRef) {
			requestAnimationFrame(() => {
				const wrapper = pdfContentsRef.current.querySelector(".page-wrapper");
				const originalWidth = wrapper.getBoundingClientRect().width;
				setOriginalWidth(originalWidth);
			});
		}
	}, [renderContent]);

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

				const url = `${baseURL}/src/homeIcon.svg`;
				await api(url)
					.then((svgData) => {
						pageDivClone.innerHTML = svgData.data;
						updatePageLoadingState(index + 1, "lazy-loading");
					})
					.catch((error) => console.error("SVG 못 가져옴", error));

				return {
					component: <PageCanvasGroup pageNum={index + 1} canvasFrame={textLayer} book={book} />,
					container: canvasLayer,
				};
			})
		);
		setCanvasComponents(mapCanvasContainer);
		setRenderContent(true);
	}

	return (
		<div>
			<Grid container spacing={2} style={{ position: "relative" }}>
				<Grid item xs={true}>
					{/* <Chart /> */}
				</Grid>
				<Grid item xs={12} sm={8} style={{ minWidth: "800px" }}>
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
				<Grid item xs={true} style={{ position: "relative" }}>
					{/* <RoomUserList /> */}
					<Box>
						<Highlights bookId={book.id} renderContent={renderContent} />
					</Box>
				</Grid>
			</Grid>
			<Info />
			{canvasComponents.map(({ component, container }) => {
				return component && createPortal(component, container);
			})}
			<DraggableElement startX={window.innerWidth / 2} startY={60}>
				<PenController />
			</DraggableElement>
			<CursorCanvasController />
			<DrawingCanvasController />
		</div>
	);
}

export default PDFViewer;
