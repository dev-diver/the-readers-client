import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import { canvasMouse, canvasMouseOut } from "./CursorCanvasController/util";
import {
	userState,
	roomUsersState,
	cursorCanvasRefFamily,
	penModeState,
	bookChangedState,
	pageLoadingStateFamily,
	viewerScaleState,
	viewerScaleApplyState,
	pageScrollTopFamily,
	scrollerRefState,
	currentPageState,
	renderContentState,
	buttonGroupsPosState,
	selectedHighlightInfoState,
	highlightLoadStateFamily,
} from "recoil/atom";
import api from "api";

import UserPageDrawingCanvas from "./DrawingCanvasController/UserPageDrawingCanvas";
import { getRelativeTop } from "../PdfScroller/util";
import { loadAndDrawPageHighlight } from "pages/RoomRouter/Room/PDFViewer/Highlighter/util";

function PageCanvasGroup({ pageNum, canvasFrame, book }) {
	const { bookId, roomId } = useParams();
	// 여기에서 추가하기
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [cursorCanvasRef, setCursorCanvasRef] = useRecoilState(
		cursorCanvasRefFamily({ bookId: bookId, pageNum: pageNum })
	);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [scroller, setScroller] = useRecoilState(scrollerRefState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [scaleApply, setScaleApply] = useRecoilState(viewerScaleApplyState);
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const [renderContent, setRenderContent] = useRecoilState(renderContentState);

	const scrollerProps = {
		ref: scroller,
		scale,
	};

	const setButtonGroupsPos = useSetRecoilState(buttonGroupsPosState);
	const setSelectedHighlightInfo = useSetRecoilState(selectedHighlightInfoState);

	const prevLoadingState = useRecoilValue(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum - 1 }));
	const loadingState = useRecoilValue(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum }));
	const nextLoadingState = useRecoilValue(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum + 1 }));
	const recoilProps = {
		setButtonGroupsPos,
		setSelectedHighlightInfo,
	};

	const setRef = useCallback(
		(el) => {
			setCursorCanvasRef({ current: el });
		},
		[pageNum, bookChanged, setCursorCanvasRef]
	);

	const updatePageLoadingState = useRecoilCallback(
		({ set }) =>
			(bookId, pageNum, loadingState) => {
				// console.warn("pageGroup book", bookId, "page", pageNum, "set", loadingState);
				console.warn("pageGroup book", bookId, "page", pageNum, "set", loadingState);
				set(pageLoadingStateFamily({ bookId: bookId, pageNum: pageNum }), loadingState);
			},
		[]
	);

	const loadAllUserPageHighlight = useRecoilCallback(
		({ snapshot, set }) =>
			(roomUsers, bookId, pageNum) => {
				console.log("loadAllUserPageHighlight", roomUsers, bookId, pageNum);
				roomUsers.forEach(async (roomUser) => {
					const userId = roomUser.id;
					const loadState = await snapshot.getPromise(
						highlightLoadStateFamily({ bookId: bookId, userId: userId, pageNum: pageNum })
					);
					console.log("room users", roomUser.id, "book", bookId, "page", pageNum, "highlight loadState", loadState);
					if (loadState) return;
					let mine = userId == user.id;
					loadAndDrawPageHighlight(userId, bookId, pageNum, mine, scrollerProps, recoilProps);
					set(highlightLoadStateFamily({ bookId: bookId, userId: userId, pageNum: pageNum }), true);
				});
			},
		[scroller, recoilProps]
	);

	const setPageScrollTop = useSetRecoilState(pageScrollTopFamily({ bookId: bookId, pageNum: pageNum }));

	useEffect(() => {
		if (!loadingState || !scroller || !scaleApply) return;
		const canvasScrollTop = getRelativeTop(canvasFrame, scroller);
		const scaledScrollTop = canvasScrollTop * scale - 1;
		setPageScrollTop(scaledScrollTop);
		// console.log(scale, "setScaledScrollTop", pageNum, loadingState, scaledScrollTop);
	}, [loadingState, scale, scroller, scaleApply]);

	useEffect(() => {
		if (renderContent && currentPage == pageNum) {
			console.log("load page", pageNum, loadingState, renderContent);
			if (prevLoadingState == "lazy-loading") {
				updatePageLoadingState(bookId, pageNum - 1, "loading");
			}
			if (loadingState == "lazy-loading") {
				updatePageLoadingState(bookId, pageNum, "loading");
			}
			if (nextLoadingState == "lazy-loading") {
				updatePageLoadingState(bookId, pageNum + 1, "loading");
			}
		}
	}, [currentPage, renderContent, loadingState]);

	useEffect(() => {
		const bookUrlName = book?.urlName;
		console.warn("loadings state", loadingState);
		if (bookUrlName && loadingState == "loading") {
			console.warn("loadings state loading!");
			loadPageContent(bookUrlName, pageNum);
		}
	}, [loadingState]);

	useEffect(() => {
		if (loadingState == "loaded" && user) {
			console.log("loadAllUserPageHighlight", pageNum);
			loadAllUserPageHighlight(roomUsers, bookId, pageNum);
		}
	}, [bookId, loadingState, roomUsers]);

	const loadPageContent = async (bookUrlName, pageNum) => {
		const pageHexNum = pageNum.toString(16);
		const pageDiv = document.getElementById(`pf${pageHexNum}`);
		if (!pageDiv) {
			return;
		}
		const fileName = pageDiv.getAttribute("data-page-url");

		console.log("bookUrlName", bookUrlName, "fileName", fileName);
		if (!fileName || parseInt(bookUrlName.split("_")[1]) != parseInt(fileName.split("_")[1])) {
			console.info("로드차이", bookUrlName, fileName, pageDiv);
			return;
		}
		const url = `/storage/pdf/${bookUrlName}/pages/${fileName}`;
		api(url)
			.then((response) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(response.data, "text/html");
				const pageDivLoad = doc.querySelector(".pf");
				const pageDivParent = pageDiv.parentNode;
				console.log("pageDiv", pageDiv, pageDivParent);
				if (!pageDivParent) {
					console.info("삭제 타이밍 차이");
					return;
				}
				pageDivParent.replaceChild(pageDivLoad, pageDiv);
				updatePageLoadingState(bookId, pageNum, "loaded");
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const info = { user: user, bookId: bookId, pageNum: pageNum };
	//pointer canvas도 밖으로 빼기
	return (
		<div className="page-canvas-group">
			<canvas
				id={`pointer-canvas-${pageNum}`}
				ref={setRef}
				width={canvasFrame.scrollWidth}
				height={canvasFrame.scrollHeight}
				style={{
					border: "1px solid black",
					pointerEvents: user && penMode == "pointer" ? "auto" : " none",
					position: "absolute",
					left: 0,
					top: 0,
				}}
				onMouseMove={(e) => canvasMouse(e, info)}
				onMouseOut={(e) => canvasMouseOut(info)}
			></canvas>
			{roomUsers?.map((roomUser, i) => (
				<UserPageDrawingCanvas key={i} index={i} pageNum={pageNum} canvasFrame={canvasFrame} roomUser={roomUser} />
			)) || []}
		</div>
	);
}

export default PageCanvasGroup;
