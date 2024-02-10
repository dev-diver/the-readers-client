import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "socket.js";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";
import BookShelf from "components/BookShelf";
import AddBook from "pages/RoomLobby/Addbook";
import { Link } from "react-router-dom";
import api from "api";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState, isLeadState, isTrailState, roomState } from "recoil/atom";
import Info from "components/Header/Info";

function Room() {
	const { bookId, roomId } = useParams();
	const [book, setBook] = useState({});
	const [roomRefresh, setRoomRefresh] = useState(false);
	const [isTrail, setTrail] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [user, setUser] = useRecoilState(userState);
	const [room, setRoom] = useRecoilState(roomState);

	const navigate = useNavigate();

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			setRoom(response.data.data);
		});
	}, [roomId]);

	useEffect(() => {
		if (isLead) {
			console.log("request-attention-book", user.id, book.id);

			socket.emit("request-attention-book", {
				userId: user.id,
				bookId: bookId,
			});
		}
	}, [bookId]);

	useEffect(() => {
		if (isTrail) {
			socket.on("receive-attention-book", (data) => {
				console.log("receive-attention-book", data);
				navigate(`/room/${roomId}/book/${data.bookId}`);
			});
		}
		return () => {
			socket.off("receive-attention-book");
		};
	}, [isTrail, isLead]);

	useEffect(() => {
		const findBook = room.Books?.find((book) => book.id == bookId);
		setBook(findBook);
	}, [room, bookId]);

	const bookClickHandler = (book) => {
		//for animation
		setTrail(false);
		navigate(`/room/${roomId}/book/${book.id}`);
	};

	return (
		<Box
			className="container"
			sx={{
				display: "grid",
				gridTemplateColumns: "1fr",
				gridTemplateRows: "auto 1fr",
				maxWidth: "1400px",
				width: "100%",
				margin: "0 auto",
				overflow: "hidden",
			}}
		>
			{/* <RtcViewer/> */}
			<Box sx={{ gridColumn: "1", gridRow: "1", justifySelf: "end" }}>
				<Info room={room} bookClickHandler={bookClickHandler} setRoomRefresh={setRoomRefresh} bookId={bookId} />
			</Box>
			<Box>{book && <PDFViewer book={book} />}</Box>
		</Box>
	);
}

export default Room;
