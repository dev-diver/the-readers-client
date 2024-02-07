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
import { useLocation } from "react-router-dom";

export default function PdfScroller({ renderContent, children }) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const pageNum = queryParams.get("page");
	const highlightId = queryParams.get("highlightId");

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
				console.log("receive-attention-scroll", data);
				smoothScrollTo(scrollerRef, data.scrollTop);
			});
		}
		return () => {
			socket.off("receive-attention-scroll");
		};
	}, [scrollerRef, isTrail]);

	const debounceSetScroll = useCallback(
		debounce(() => {
			setScroll(calculateScrollY(scrollerRef));
		}, 1000),
		[scrollerRef, setScroll]
	);

	const handleScroll = useCallback(
		(event) => {
			console.log("handleScroll");
			const scrollTop = event.currentTarget.scrollTop;
			if (isLead) {
				console.log("lead-scroll", scrollTop);
				socket.emit("request-attention-scroll", {
					userId: user.id,
					scrollTop: scrollTop,
				});
			}
			// setAttention(false);
			debounceSetScroll(); //for chart
		},
		[isLead, debounceSetScroll, user, socket]
	);

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
