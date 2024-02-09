import React, { useEffect } from "react";

import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
import BookCarousel from "components/BookCarousel";
import { baseURL } from "config/config";
import { useRecoilState } from "recoil";
import { isMainState } from "recoil/atom";
// baseURL 정의 (예시 경로, 실제 프로젝트에 맞게 조정해야 합니다)

// 책 커버 이미지 정보를 담고 있는 객체의 배열인 bookCovers를 생성
// map 함수를 사용하여 5개의 책 커버 이미지 정보를 담고 있는 객체를 생성하고, 배열에 저장함
const bookCovers = new Array(5).fill(null).map((_, i) => {
	return { id: i, image: `${baseURL}/src/bookcovers/${i + 1}.jpg` };
});

function Main() {
	const [isMain, setIsMain] = useRecoilState(isMainState);

	useEffect(() => {
		setIsMain(true);
		// 컴포넌트가 언마운트될 때 실행될 클린업 함수를 반환
		return () => {
			setIsMain(false);
		};
	}, []); // 빈 의존성 배열을 전달하여 컴포넌트 마운트/언마운트 시에만 실행되도록 함

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
