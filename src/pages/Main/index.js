import React from "react";

import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
// baseURL 정의 (예시 경로, 실제 프로젝트에 맞게 조정해야 합니다)

// 책 커버 이미지 정보를 담고 있는 객체의 배열인 bookCovers를 생성
// map 함수를 사용하여 5개의 책 커버 이미지 정보를 담고 있는 객체를 생성하고, 배열에 저장함
const bookCovers = new Array(5).fill(null).map((_, i) => {
	return { id: i, image: `${baseURL}/src/bookcovers/${i + 1}.jpg` };
});

function Main() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<BookCarousel initialItems={bookCovers} initialActive={0} />
			<FindRoom />
		</Box>
	);
}

export default Main;
