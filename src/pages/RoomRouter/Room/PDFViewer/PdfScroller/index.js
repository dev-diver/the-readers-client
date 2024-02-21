import React, { useEffect, useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import {
	userState,
	isTrailState,
	isLeadState,
	scrollerRefState,
	highlightListState,
	viewerScaleState,
	currentPageState,
	bookState,
	buttonGroupsPosState,
} from "recoil/atom";
import socket from "socket";
import { scrollToPage, scrollToHighlight, smoothScrollTo, useDetermineCurrentPage } from "./util";
import { Box } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

export default function PdfScroller({ renderContent, children }) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const pageNum = queryParams.get("page");
	const highlightId = queryParams.get("highlightId");
	const determineCurrentPage = useDetermineCurrentPage();

	const { bookId } = useParams();

	const [user, setUser] = useRecoilState(userState);
	const [isTrail, setAttention] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [highlightList, setHighlightList] = useRecoilState(highlightListState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [urlScrolled, setUrlScrolled] = useState(false);
	// ButtonGroups 렌더링 위치 및 가시성 상태
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const [book, setBook] = useRecoilState(bookState);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);

	useEffect(() => {
		setUrlScrolled(false);
	}, [location]);

	useEffect(() => {
		if (!urlScrolled && renderContent && scrollerRef && pageNum) {
			console.log("scroll page");
			scrollToPage(scrollerRef, pageNum, scale);
			setUrlScrolled(true);
		}
	}, [location, renderContent, scrollerRef, pageNum, urlScrolled]);

	useEffect(() => {
		if (!urlScrolled && highlightId && scrollerRef && highlightId && highlightList.length > 0) {
			console.log("scroll highlightID", highlightList);
			scrollToHighlight(scrollerRef, highlightId, scale);
			setUrlScrolled(true);
		}
	}, [location, highlightList, highlightId, scrollerRef, urlScrolled]);

	useEffect(() => {
		// console.log("is Trail", isTrail);
		if (isTrail) {
			socket.on("receive-attention-scroll", (data) => {
				setButtonGroupsPos({ visible: false, top: 0, left: 0 });
				console.log("receive-attention-scroll", data.scale, scale);
				if (data.scale != scale) setScale(data.scale);
				smoothScrollTo(scrollerRef, data.scrollTop);
			});
		}
		return () => {
			socket.off("receive-attention-scroll");
		};
	}, [scrollerRef, isTrail, scale]);

	// setButtonGroupsPos는 의존성에서 제거

	const handleScroll = (event) => {
		setButtonGroupsPos({ visible: false, top: 0, left: 0 });
		const scrollTop = event.currentTarget.scrollTop;
		const scrollLeft = event.currentTarget.scrollLeft;
		if (isLead) {
			console.log("lead-scroll", scrollTop);
			socket.emit("request-attention-scroll", {
				userId: user?.id,
				scale: scale,
				scrollTop: scrollTop,
				scrollLeft: scrollLeft,
			});
		}
		determineCurrentPage(bookId, book?.totalPage || 0, scrollTop).then((currentPage) => {
			console.info("currentPage", currentPage);
			setCurrentPage(currentPage);
		});
	};

	const onCtrlWheelHandler = useCallback(
		(event) => {
			const ratio = 1.1;
			if (event.altKey) {
				// event.preventDefault();
				if (event.deltaY < 0) {
					setScale((prev) => prev * ratio);
				} else {
					setScale((prev) => prev / ratio);
				}
			}
		},
		[setScale]
	);

	const setRef = useCallback((el) => setScrollerRef(el), [setScrollerRef]);

	return (
		<Box
			className="pdf-scroller"
			onScroll={handleScroll}
			onWheel={onCtrlWheelHandler}
			ref={setRef}
			sx={{
				position: "relative",
				width: "100%",
				height: "100vh",
				margin: "0 auto",
				overflowY: "auto",
				overflowX: "auto",
			}}
		>
			{children}
		</Box>
	);
}
