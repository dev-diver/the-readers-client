import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import { Grid, Box, Paper, TextField, Button } from "@mui/material";
import { LogIn } from "lucide-react";
import { baseURL } from "config/config";

import Masonry from "@mui/lab/Masonry";
import { styled } from "@mui/material/styles";

const Label = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(0.5),
	textAlign: "center",
	color: theme.palette.text.secondary,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
}));

export default function RoomCard({ room }) {
	const randomImage = itemData[Math.floor(Math.random() * itemData.length)];
	const baseHeight = 100; // 기본 높이
	const additionalHeightPerUser = 30; // 사용자당 추가 높이
	const totalHeight = baseHeight + room.usermax * additionalHeightPerUser;

	return (
		// // <Container
		// // 	className="card"
		// // 	style={{
		// // 		backgroundColor: "#4a90e2",
		// // 		textAlign: "center",
		// // 		color: "black",
		// // 		padding: "0px",
		// // 	}}
		// // >
		// <Paper elevation={3}>
		// 	<div>
		// 		<img
		// 			src={`${baseURL}/src/bookcovers/1.jpg`}
		// 			style={{
		// 				minHeight: `${room.usermax * 10 + 100}px`,
		// 				height: "auto",
		// 				width: "100%",
		// 				maxWidth: "100%",
		// 			}}
		// 		/>
		// 	</div>
		// 	<div>
		// 		<p>책 목록</p>
		// 		<div>{room.Books?.map((book, i) => <span key={i}>{book.name}</span>) || <></>}</div>
		// 	</div>
		// </Paper>
		// // </Container>
		//2번째 방법
		// <Box sx={{ width: 500, minHeight: 829 }}>
		// 	{itemData.map((item, index) => (
		// 		<div key={index}>
		// 			<Label>{index + 1}</Label>
		// 			<img
		// 				srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
		// 				src={`${item.img}?w=162&auto=format`}
		// 				alt={item.title}
		// 				loading="lazy"
		// 				style={{
		// 					borderBottomLeftRadius: 4,
		// 					borderBottomRightRadius: 4,
		// 					display: "block",
		// 					width: "100%",
		// 				}}
		// 			/>
		// 			<Grid style={{ textAlign: "center" }}>
		// 				<Grid>방 제목: {room.title}</Grid>
		// 				<p>인원 수: {room.usermax}</p>
		// 				<Link to={`/room/${room.id}`}>
		// 					<LogIn color="#000000" />
		// 				</Link>
		// 			</Grid>
		// 		</div>
		// 	))}
		// </Box>
		//3번째 방법
		<>
			<Container
				className="card"
				// style={{
				// 	backgroundColor: "#adbec4",
				// }}
			>
				{/* <Box sx={{ width: 500 }}> */}
				<div>
					<Label>
						{room.title}
						<br />
						{room.usermax}
					</Label>
					<img
						srcSet={`${randomImage.img}?w=162&auto=format&dpr=2 2x`}
						src={`${randomImage.img}?w=162&auto=format`}
						alt={randomImage.title}
						loading="lazy"
						style={{
							borderBottomLeftRadius: 4,
							borderBottomRightRadius: 4,
							display: "block",
							width: "100%",
							maxHeight: `${totalHeight}px`,
							height: "auto",
						}}
					/>
				</div>
				<Label style={{ textAlign: "center" }}>
					<Link to={`/room/${room.id}`}>
						<LogIn color="#000000" />
					</Link>
				</Label>
				{/* </Box> */}
			</Container>
		</>
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
