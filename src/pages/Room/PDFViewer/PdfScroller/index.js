import React, { useEffect, useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import {
	userState,
	scrollYState,
	isTrailState,
	isLeadState,
	scrollerRefState,
	highlightState,
	viewerScaleState,
} from "recoil/atom";
import { debounce } from "lodash";
import socket from "socket";
import { scrollToPage, scrollToHighlight, calculateScrollY, smoothScrollTo } from "./util";
import { Box } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useDetermineCurrentPage } from "./util";

export default function PdfScroller({ renderContent, totalPage, children }) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const pageNum = queryParams.get("page");
	const highlightId = queryParams.get("highlightId");
	const determineCurrentPage = useDetermineCurrentPage();

	const { bookId } = useParams();

	const [user, setUser] = useRecoilState(userState);
	const [scroll, setScroll] = useRecoilState(scrollYState); //forChart
	const [isTrail, setAttention] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [urlScrolled, setUrlScrolled] = useState(false);

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
		console.log("is Trail", isTrail);
		if (isTrail) {
			socket.on("receive-attention-scroll", (data) => {
				console.log("receive-attention-scroll", data.scale, scale);
				if (data.scale != scale) setScale(data.scale);
				smoothScrollTo(scrollerRef, data.scrollTop);
			});
		}
		return () => {
			socket.off("receive-attention-scroll");
		};
	}, [scrollerRef, isTrail, scale]);

	const debounceSetScroll = useCallback(
		debounce(() => {
			setScroll(calculateScrollY(scrollerRef));
		}, 1000),
		[scrollerRef, setScroll]
	);

	const handleScroll = (event) => {
		const scrollTop = event.currentTarget.scrollTop;
		if (isLead) {
			console.log("lead-scroll", scrollTop);
			socket.emit("request-attention-scroll", {
				userId: user?.id,
				scale: scale,
				scrollTop: scrollTop,
			});
		}
		// setAttention(false);
		determineCurrentPage(totalPage, scrollTop).then((currentPage) => {
			console.info("currentPage", currentPage);
			//debounceSetScroll(); //for chart
		});
		debounceSetScroll(); //for chart
	};
	//[isLead, debounceSetScroll, user, scale, bookId]

	const onCtrlWheelHandler = useCallback(
		(event) => {
			const ratio = 1.1;
			if (event.ctrlKey) {
				console.log("ctrlWheel");
				event.preventDefault();
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
			}}
		>
			{children}
		</Box>
	);
}
