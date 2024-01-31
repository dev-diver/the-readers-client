import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";
import BookShelf from "components/BookShelf";
import api from "api";

function Room() {
	const { bookId } = useParams();
	const { roomId } = useParams();
	const [room, setRoom] = useState({ Books: [] });
	const [book, setBook] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			console.log(response.data);
			setRoom(response.data.data);
		});
	}, []);

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
			{room && <BookShelf books={room.Books} bookClickhandler={bookClickHandler} />}
			{book && <PDFViewer book={book} />}
		</div>
	);
}

export default Room;
