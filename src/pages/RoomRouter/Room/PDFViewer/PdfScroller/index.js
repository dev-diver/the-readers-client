import React, { useEffect, useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import {
	userState,
	isTrailState,
	isLeadState,
	scrollerRefState,
	highlightState,
	viewerScaleState,
	buttonGroupsPosState,
	currentHighlightIdState,
	currentPageState,
	bookState,
} from "recoil/atom";
import socket from "socket";
import { scrollToPage, scrollToHighlight, smoothScrollTo, useDetermineCurrentPage } from "./util";
import { Box } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import ButtonGroups from "components/ButtonGroups";

export default function PdfScroller({ renderContent, children }) {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const pageNum = queryParams.get("page");
	const highlightId = queryParams.get("highlightId");
	const determineCurrentPage = useDetermineCurrentPage();

	const { roomId, bookId } = useParams();

	const [user, setUser] = useRecoilState(userState);
	const [isTrail, setAttention] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scale, setScale] = useRecoilState(viewerScaleState);
	const [urlScrolled, setUrlScrolled] = useState(false);
	// ButtonGroups 렌더링 위치 및 가시성 상태
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);
	const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);
	const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
	const [book, setBook] = useRecoilState(bookState);

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
				console.log("receive-attention-scroll", data.scale, scale);
				if (data.scale != scale) setScale(data.scale);
				smoothScrollTo(scrollerRef, data.scrollTop);
			});
		}
		return () => {
			socket.off("receive-attention-scroll");
		};
	}, [scrollerRef, isTrail, scale]);

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

	const closebuttonGroups = (e) => {
		setButtonGroupsPos({ visible: false, x: 0, y: 0 });
	};

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
			{buttonGroupsPos.visible && (
				<ButtonGroups
					style={{
						position: "absolute",
						top: buttonGroupsPos.y - 20 + "px",
						left: buttonGroupsPos.x + "px",
					}}
					highlightId={currentHighlightId}
					bookId={bookId}
					roomId={roomId}
					onClose={() => {
						closebuttonGroups();
					}}
					scrollerRef={scrollerRef}
				/>
			)}
		</Box>
	);
}
