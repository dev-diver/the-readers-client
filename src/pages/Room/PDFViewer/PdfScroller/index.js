import React, { useEffect, useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { scrollYState, isTrailState, scrollerRefState, highlightState, viewerScaleState } from "recoil/atom";
import { debounce } from "lodash";
import socket from "socket";
import { scrollToPage, scrollToHighlight, calculateScrollY, smoothScrollTo } from "./util";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function PdfScroller({ renderContent, children }) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const pageNum = queryParams.get("page");
	const highlightId = queryParams.get("highlightId");

	const [scroll, setScroll] = useRecoilState(scrollYState); //forChart
	const [isAttention, setAttention] = useRecoilState(isTrailState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [urlScrolled, setUrlScrolled] = useState(false);

	useEffect(() => {
		setUrlScrolled(false);
	}, [location]);

	useEffect(() => {
		console.log("scroll with pageNum", pageNum, scrollerRef, renderContent, urlScrolled);
		if (!urlScrolled && renderContent && scrollerRef && pageNum) {
			console.log("scroll page");
			scrollToPage(scrollerRef, pageNum, scale);
			setUrlScrolled(true);
		}
	}, [location, renderContent, scrollerRef, pageNum, urlScrolled]);

	useEffect(() => {
		console.log("scroll with highlightId", highlightId, scrollerRef);
		if (!urlScrolled && highlightId && scrollerRef && highlightId && highlightList.length > 0) {
			console.log("scroll highlightID", highlightList);
			scrollToHighlight(scrollerRef, highlightId, scale);
			setUrlScrolled(true);
		}
	}, [location, highlightList, highlightId, scrollerRef, urlScrolled]);

	useEffect(() => {
		if (isAttention && scrollerRef) {
			socket.on("attention_scroll", (data) => {
				smoothScrollTo(scrollerRef, data.scrollTop);
			});
		} else {
			socket.off("attention_scroll");
		}
	}, [scrollerRef, isAttention]);

	useEffect(() => {
		const pageContainer = document.getElementsByClassName("pdf-container")[0];
		if (!pageContainer) return;
		// 스크롤 이벤트 리스너 추가
		pageContainer.addEventListener("scroll", () => handleContainerScroll());
		// 컴포넌트가 언마운트될 때 리스너 제거
		return () => pageContainer.removeEventListener("scroll", () => handleContainerScroll());
	}, []);

	const handleContainerScroll = debounce(() => {
		setScroll(calculateScrollY(scrollerRef));
	}, 1000);

	const handleScroll = useCallback((event) => {
		const scrollTop = event.currentTarget.scrollTop;
		socket.emit("attention_scroll", {
			cleintID: 1,
			scrollTop: scrollTop,
		});
		setAttention(false);
	}, []);

	const setRef = useCallback((el) => setScrollerRef(el), [setScrollerRef]);

	return (
		<Box
			className="pdf-scroller"
			onScroll={handleScroll}
			ref={setRef}
			sx={{
				position: "relative",
				width: "800px",
				height: "100vh",
				margin: "0 auto",
				overflowY: "auto",
			}}
		>
			{children}
		</Box>
	);
}
