import React, { useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import FindRoom from "components/FindRoom";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
import { LobbyCanvas } from "pages/RoomRouter/3DRoom";
// baseURL 정의 (예시 경로, 실제 프로젝트에 맞게 조정해야 합니다)
import "./canvas.css";
const books = new Array(5).fill(null).map((_, i) => {
	return {
		id: i,
		name: `Book ${i + 1}`,
		urlName: `book${i + 1}`,
	};
});

function Main() {
	const bookClickHandler = (book) => {
		return;
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center", // 가로 방향으로 중앙 정렬
				marginTop: 10,
			}}
		>
			<LobbyCanvas books={books} bookClickHandler={bookClickHandler} isFake={true} />
			<FindRoom />
		</Box>
	);
}

export default Main;
