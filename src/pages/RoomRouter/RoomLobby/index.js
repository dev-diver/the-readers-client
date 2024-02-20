import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "api";
import AddBook from "components/Addbook";
import { useRecoilState } from "recoil";
import { bookIdState } from "recoil/atom";
import { Masonry } from "@mui/lab";
import { Box, Button, Paper, Typography, styled } from "@mui/material";
import BookCover from "./BookCover";

const RoomPage = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const [room, setRoom] = useState(null);
	const [roomRefresh, setRoomRefresh] = useState(false);
	const [bookId, setBookId] = useRecoilState(bookIdState);

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			setRoom(response.data.data);
		});
	}, [roomId, roomRefresh]);

	const bookClickHandler = (book) => () => {
		navigate(`/room/${roomId}/book/${book.id}`);
		setBookId(book.id);
	};

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		backgroundImage: 'url("/room/wooden-desk.jpg")', // 나무 질감 배경 이미지
		backgroundSize: "cover",
		...theme.typography.body2,
		padding: theme.spacing(0.5),
		textAlign: "center",
		color: theme.palette.text.secondary,
		boxShadow: "5px 5px 15px rgba(0,0,0,0.5)", // 현실감 있는 그림자 추가
		border: "1px solid #8b5f4d", // 나무 색상에 맞는 테두리 색상
		borderRadius: theme.shape.borderRadius, // 적당한 둥근 모서리
	}));

	const Label = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
		...theme.typography.body2,
		padding: theme.spacing(0.5),
		textAlign: "center",
		color: theme.palette.text.secondary,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		// 부모(Item)의 너비가 200px, 높이가 300px로 가정한 경우
		width: "150px",
		height: "200px",
	}));

	const books = room?.Books;
	console.log("books", books);
	if (books) {
		books.map((book) => {
			console.log("book.id", book.id);
			console.log("book.name", book.name);
			console.log("book.urlName", book.urlName);
		});
	}
	// const isCurrentBook = book.id === Number(bookId);

	// console.log("roomId", room.Books[0].id, room.Books[0].name, room.Books[0].urlName);
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
			<Box height="800px" margin="auto" width="80%" maxWidth="1200px">
				<Box flex={1} display="flex" flexDirection="column" width="100%" mb="30px" px="24px">
					{room && (
						<>
							<Typography variant="h3" component="h1" mb="30px">
								<span
									style={{
										backgroundColor: "rgba(184, 135, 61, 0.5)",
										paddingLeft: "15px",
										paddingRight: "15px",
										borderRadius: "5px",
									}}
								>
									방 제목: {room?.title || ""}
								</span>
							</Typography>
							<AddBook room={room} refresher={setRoomRefresh} />
							<Typography variant="h4" component="h2">
								책 목록
							</Typography>
						</>
					)}
				</Box>
				<Box flex={4} display="flex" width="100%" justifyContent="center" alignItems="center">
					{room && (
						<Masonry columns={4} spacing={6} width="100%">
							{books?.length != 0 ? (
								books.map((book, index) => (
									<Item
										key={index}
										sx={{
											height: "300px",
											width: "300px",
											padding: "15px",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<BookCover />
									</Item>
								))
							) : (
								<Typography variant="h6" component="h4">
									책이 아직 없어요.
								</Typography>
							)}
						</Masonry>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default RoomPage;
