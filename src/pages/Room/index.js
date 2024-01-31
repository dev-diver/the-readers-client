import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";
import BookShelf from "components/BookShelf";
import api from "api";
import { find } from "lodash";

function Room() {
	const { bookId } = useParams();
	const { roomId } = useParams();
	const [room, setRoom] = useState({ Books: [] });
	const [book, setBook] = useState({});

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

	return (
		<div className="container">
			{/* <RtcViewer/> */}
			{room && <BookShelf room={room} />}
			{book && <PDFViewer book={book} />}
		</div>
	);
}

export default Room;
