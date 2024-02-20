import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography, CardMedia, CardContent } from "@mui/material";

import { useRecoilState } from "recoil";
import { roomUsersState } from "recoil/atom";
import { Card } from "react-bootstrap";

export default function RoomCard({ room }) {
	const randomImage = itemData[Math.floor(Math.random() * itemData.length)];
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const { id, title, usermax } = room;
	const userCount = roomUsers[id]?.length || 0;
	const navigate = useNavigate();

	return (
		<Link to={`/room/${id}`}>
			<Card sx={{ p: 2, maxWidth: 300, m: 2, boxShadow: 3 }}>
				<Box sx={{ cursor: "pointer", width: "100%" }}>
					<CardMedia component="img" height="140" image={randomImage?.img || "defaultImage.jpg"} />
				</Box>
				<CardContent sx={{ cursor: "pointer", backgroundColor: "white" }}>
					<Typography
						gutterBottom
						variant="h5"
						component="div"
						sx={{ width: "100%", padding: 1, borderBottom: "1px solid #999", block: "inline-block" }}
					>
						{title}
					</Typography>
				</CardContent>
				<CardContent sx={{ backgroundColor: "white" }}>
					<Typography variant="body2" color="text.secondary">
						현재 인원/최대 인원: {userCount}/{usermax}
					</Typography>
					<Button variant="contained" size="small" color="primary" sx={{ marginTop: "16px" }}>
						입장하기
					</Button>
				</CardContent>
			</Card>
		</Link>
	);
}

const itemData = [
	{
		img: "https://image.yes24.com/goods/124434554/XL",
		title: "이것이 백엔드 개발이다.",
	},
	{
		img: "https://blog.kakaocdn.net/dn/lTuUE/btqWX4TzrwI/lONqmD26MgbYndegLtqAI1/img.jpg",
		title: "이것이 c#이다.",
	},
	{
		img: "https://img.ridicdn.net/cover/443001063/xxlarge",
		title: "이것이 자료구조 알고리즘이다.",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791160508796.jpg",
		title: "리액트를 다루는 기술",
	},
	{
		img: "https://www.hanbit.co.kr/data/books/B3942115529_l.jpg",
		title: "Lerning React",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788956749013.jpg",
		title: "리액트 200제",
	},
	{
		img: "https://image.yes24.com/goods/96639635/XL",
		title: "모던 자바스크립트",
	},
	{
		img: "https://image.yes24.com/goods/59410698/XL",
		title: "모던 자바스크립트 입문",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791163030911.jpg",
		title: "점프 투 파이썬",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788968482397.jpg",
		title: "처음 시작하는 파이썬",
	},
	{
		img: "https://image.yes24.com/goods/89649360/XL",
		title: "리팩토링",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/280x0/pdt/9788968481901.jpg",
		title: "Nature of Code",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788966260959.jpg",
		title: "Clean Code",
	},
	{
		img: "https://gimg.gilbut.co.kr/book/BN002889/rn_view_BN002889.jpg",
		title: "모두의 자바",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788994492032.jpg",
		title: "자바의 정석",
	},
	{
		img: "https://bookthumb-phinf.pstatic.net/cover/086/380/08638049.jpg",
		title: "몰입!자바스크립트",
	},
	{
		img: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788956749242.jpg",
		title: "C언어 100제",
	},
];

// itemData 배열에서 무작위 이미지를 선택하는 함수
function getRandomImage(itemData) {
	const randomIndex = Math.floor(Math.random() * itemData.length);
	return itemData[randomIndex];
}
