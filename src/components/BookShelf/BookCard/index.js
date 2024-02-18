import React from "react";
import "./style.css";
import { Box, Typography } from "@mui/material";
import { Tooltip } from "@mui/material";

function BookCard({ index, book, bookId, handler }) {
	const isCurrentBook = book.id === Number(bookId);
	// book.name을 글자 단위로 분리하여 배열로 변환
	const letters = book.name.split("");
	return (
		<Box
			key={book.id}
			className="book-card"
			onClick={handler}
			sx={{
				height: "70px",
				width: "30px",
				backgroundColor: isCurrentBook ? "#a86e16" : "#b8863c",
				borderTopRightRadius: "12px",
				borderBottomRightRadius: "12px",
				// borderBottom: isCurrentBook ? "10px solid #a86e16" : "10px solid #b8863c",
				padding: "10px",
				display: "flex",
				flexDirection: "column", // 세로 방향으로 내용을 정렬
				justifyContent: "flex-start",
				alignItems: "center", // 가로 방향 중앙 정렬
				overflow: "hidden", // 내용이 Box를 넘어가면 숨김
				boxShadow: "inset 0 4px 4px -4px rgba(0,0,0,0.2), 4px 4px 4px 0 rgba(0,0,0,0.2)",
				marginBottom: "2px",
				"&:hover": {
					backgroundColor: isCurrentBook ? "#865811" : "#a86e16", // 호버 시 배경 색상 변경
				},
				"&:active": {
					backgroundColor: isCurrentBook ? "#865811" : "#a86e16", // 클릭 시 배경 색상 변경
				},
			}}
			py={1}
		>
			<Tooltip title={book.name} placement="right">
				<Typography sx={{ lineHeight: 1 }}>{index + 1}</Typography>
			</Tooltip>
		</Box>
	);
}

export default BookCard;
