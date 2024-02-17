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
	pageScrollTopFamily,
	scrollerRefState,
	currentPageState,
} from "recoil/atom";
import api from "api";

import UserPageDrawingCanvas from "./DrawingCanvasController/UserPageDrawingCanvas";
import { getRelativeTop } from "../PdfScroller/util";

function PageCanvasGroup({ pageNum, canvasFrame, book }) {
	const { bookId, roomId } = useParams();
	// 여기에서 추가하기
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [cursorCanvasRef, setCursorCanvasRef] = useRecoilState(
		cursorCanvasRefFamily({ bookId: book.id, pageNum: pageNum })
	);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [scroller, setScroller] = useRecoilState(scrollerRefState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const loadingState = useRecoilValue(pageLoadingStateFamily({ pageNum: pageNum }));

	const setRef = useCallback(
		(el) => {
			setCursorCanvasRef({ ref: el });
		},
		[pageNum, bookChanged, setCursorCanvasRef]
	);

	const updatePageLoadingState = useRecoilCallback(
		({ set }) =>
			(loadingState) => {
				set(pageLoadingStateFamily({ pageNum: pageNum }), loadingState);
			},
		[]
	);

	const setPageScrollTop = useSetRecoilState(pageScrollTopFamily({ pageNum: pageNum }));

	useEffect(() => {
		console.log("loadingState", pageNum, loadingState);
		if (!loadingState) return;
		const canvasScrollTop = getRelativeTop(canvasFrame, scroller);
		setPageScrollTop(canvasScrollTop * scale);
	}, [loadingState, scale]);

	useEffect(() => {
		if (currentPage == pageNum && loadingState == "lazy-loading") {
			console.log("load page", pageNum, loadingState);
			loadPageContent(pageNum);
		}
	}, [currentPage]);

	const loadPageContent = async (pageNum) => {
		updatePageLoadingState("loading");
		const pageHexNum = pageNum.toString(16);
		const pageDiv = document.getElementById(`pf${pageHexNum}`);
		const fileName = pageDiv.getAttribute("data-page-url");
		const url = `/storage/pdf/${book.urlName}/pages/${fileName}`;
		const pageDivLoad = await api(url)
			.then((response) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(response.data, "text/html");
				const div = doc.querySelector(".pf");
				return div;
			})
			.catch((err) => {
				console.error(err);
			});

		pageDiv.parentNode.replaceChild(pageDivLoad, pageDiv);
		updatePageLoadingState("loaded");
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
