import React, { useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { scrollYState, isTrailState } from "recoil/atom";
import { debounce } from "lodash";
import socket from "socket";
import { moveToScroll, calculateScrollY } from "./util";

export default function PdfScroller({ children, containerRef }) {
	const [scroll, setScroll] = useRecoilState(scrollYState);
	const [isAttention, setAttention] = useRecoilState(isTrailState);

	useEffect(() => {
		if (isAttention) {
			socket.on("attention_scroll", (data) => {
				moveToScroll(containerRef.current, data.scrollTop);
			});
		} else {
			socket.off("attention_scroll");
		}
	}, [containerRef.current, isAttention]);

	useEffect(() => {
		const pageContainer = document.getElementsByClassName("pdf-container")[0];
		if (!pageContainer) return;
		// 스크롤 이벤트 리스너 추가
		pageContainer.addEventListener("scroll", () => handleContainerScroll());
		// 컴포넌트가 언마운트될 때 리스너 제거
		return () => pageContainer.removeEventListener("scroll", () => handleContainerScroll());
	}, []);

	const handleContainerScroll = debounce(() => {
		setScroll(calculateScrollY(containerRef.current));
	}, 1000);

	const handleScroll = useCallback((event) => {
		const scrollTop = event.currentTarget.scrollTop;
		socket.emit("attention_scroll", {
			cleintID: 1,
			scrollTop: scrollTop,
		});
		setAttention(false);
	}, []);

	return (
		<div
			className="pdf-container"
			onScroll={handleScroll}
			ref={containerRef}
			style={{
				height: "80vh",
				width: "55%",
				overflow: "scroll",
			}}
		>
			{children}
		</div>
	);
}
