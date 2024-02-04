import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "socket.js";
import "./styles.css";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";
import BookShelf from "components/BookShelf";
import AddBook from "pages/RoomLobby/Addbook";
import { Link } from "react-router-dom";
import api from "api";

function Room() {
	const { bookId } = useParams();
	const { roomId } = useParams();
	const [room, setRoom] = useState({ Books: [] });
	const [book, setBook] = useState({});
	const [roomRefresh, setRoomRefresh] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			console.log(response.data);
			setRoom(response.data.data);
		});
		socket.emit("join-room", roomId);
		// socket.on("refresh-room", () => {
		// 	setRoomRefresh((prev) => !prev);
		// });
	}, [roomId, roomRefresh]);

	useEffect(() => {
		const findBook = room.Books?.find((book) => book.id == bookId);
		setBook(findBook);
	}, [room, bookId]);

	const bookClickHandler = (book) => {
		navigate(`/room/${roomId}/book/${book.id}`);
	};
	return (
		<div className="container">
			{/* <RtcViewer/> */}
			{room && (
				<>
					<Link to={`/room/${room.id}`}>{room.title}</Link>
					<BookShelf books={room.Books} bookClickhandler={bookClickHandler} />
					<AddBook key="book" room={room} refresher={setRoomRefresh} />
				</>
			)}
			{book && <PDFViewer book={book} />}
		</div>
	);
}

export default Room;
