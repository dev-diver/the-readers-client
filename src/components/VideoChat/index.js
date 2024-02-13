import React from "react";
import { Container, OutButton, StartButton, VideoBox, VideoContainer, Video } from "./style";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import ReactiveDraggable from "components/DragNDrop/ReactiveDraggable";

export default function VideoChat() {
	return (
		<Container>
			{/* <Box sx={{ backgroundColor: "#f7f7f7", borderRadius: "8px", border: "1px solid #ddd" }}> */}
			{/* <Paper
				sx={{
					backgroundColor: "#f7f7f7",
					borderRadius: "8px",
					border: "1px solid #ddd",
					zIndex: 100,
				}}
			> */}
			<ReactiveDraggable startX={window.innerWidth - 300} startY={60}>
				<VideoContainer>
					<VideoBox>콩서누</VideoBox>
					<VideoBox>대경현</VideoBox>
					<VideoBox>김푸딩</VideoBox>
					<VideoBox>뉴진스</VideoBox>
				</VideoContainer>
			</ReactiveDraggable>
			{/* </Paper> */}
			{/* </Box> */}
		</Container>
	);
}
