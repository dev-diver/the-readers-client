import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "socket.js";
import PDFViewer from "./PDFViewer";
import api from "api";
import { Box } from "@mui/material";
import { useRecoilState } from "recoil";
import { userState, isLeadState, isTrailState, roomState, userIdState } from "recoil/atom";

function Room() {
	const { bookId, roomId } = useParams();
	const [book, setBook] = useState({});
	const [roomRefresh, setRoomRefresh] = useState(false);
	const [isTrail, setTrail] = useRecoilState(isTrailState);
	const [isLead, setLead] = useRecoilState(isLeadState);
	const [user, setUser] = useRecoilState(userState);
	const [room, setRoom] = useRecoilState(roomState);
	const [userId, setUserId] = useRecoilState(userIdState);
	const navigate = useNavigate();

	// 성능 최적화
	useEffect(() => {
		setUserId(user.id);
	}, []);

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
		return () => {
			console.log("set book empty");
			setBook({});
		};
	}, [room, bookId]);

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
			{book && <PDFViewer book={book} />}
		</Box>
	);
}

export default Room;
