import React, { useState } from "react";
import { Container, OutButton, StartButton, VideoBox, VideoContainer, Video, Divider } from "./style";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import ReactiveDraggable from "components/DragNDrop/ReactiveDraggable";
import { useRecoilState } from "recoil";
import { LayoutState } from "recoil/atom";

export default function VideoChat() {
	const [Layout, setLayout] = useRecoilState(LayoutState);
	return (
		<Container>
			<VideoContainer
				style={{
					boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
					borderRadius: "8px",
					backgroundColor: "#f7f7f7",
					border: "1px solid #ddd",
					zIndex: 100,
				}}
			>
				<ReactiveDraggable startX={window.innerWidth - 300} startY={60}>
					<VideoBox>콩서누</VideoBox>
					<Divider layout={Layout} />
					<VideoBox>대경현</VideoBox>
					<Divider layout={Layout} />
					<VideoBox>김푸딩</VideoBox>
					<Divider layout={Layout} />
					<VideoBox>뉴진스</VideoBox>
				</ReactiveDraggable>
			</VideoContainer>
		</Container>
	);
}
