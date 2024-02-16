import React, { useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import FindRoom from "components/FindRoom";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
// baseURL 정의 (예시 경로, 실제 프로젝트에 맞게 조정해야 합니다)

const bookCovers = new Array(5).fill(null).map((_, i) => {
	return { id: i, image: `${baseURL}/src/bookcovers/${i + 1}.jpg` };
});

function Main() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center", // 가로 방향으로 중앙 정렬
				marginTop: 10,
			}}
		>
			<BookCarousel initialItems={bookCovers} initialActive={0} />
			<FindRoom />
		</Box>
	);
}

export default Main;
