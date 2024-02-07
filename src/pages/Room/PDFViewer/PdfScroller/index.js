import React, { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { scrollYState, isTrailState, htmlContentState } from "recoil/atom";
import { debounce } from "lodash";
import socket from "socket";
import { moveToScroll, calculateScrollY } from "./util";
import { Box } from "@mui/material";

export default function PdfScroller({ children, scrollerRef }) {
	const [scroll, setScroll] = useRecoilState(scrollYState);
	const [isAttention, setAttention] = useRecoilState(isTrailState);
	const [htmlContent, setHtmlContent] = useRecoilState(htmlContentState);

	useEffect(() => {
		if (isAttention) {
			socket.on("attention_scroll", (data) => {
				moveToScroll(scrollerRef.current, data.scrollTop);
			});
		} else {
			socket.off("attention_scroll");
		}
	}, [scrollerRef.current, isAttention]);

	const handleContainerScroll = debounce(() => {
		setScroll(calculateScrollY(scrollerRef.current));
	}, 1000);

	useEffect(() => {
		const pageContainer = document.getElementsByClassName("pdf-scroller")[0];
		if (!pageContainer) return;
		// 스크롤 이벤트 리스너 추가
		pageContainer.addEventListener("scroll", () => handleContainerScroll());
		// 컴포넌트가 언마운트될 때 리스너 제거
		return () => pageContainer.removeEventListener("scroll", () => handleContainerScroll());
	}, [htmlContent]);

	const handleScroll = useCallback((event) => {
		const scrollTop = event.currentTarget.scrollTop;
		socket.emit("attention_scroll", {
			cleintID: 1,
			scrollTop: scrollTop,
		});
		setAttention(false);
	}, []);

	return (
		<Box
			className="pdf-scroller"
			onScroll={handleScroll}
			ref={scrollerRef}
			sx={{
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
