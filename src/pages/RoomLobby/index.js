import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BookShelf from "components/BookShelf";
import api from "api";
import AddBook from "./Addbook";

const RoomPage = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const [room, setRoom] = useState(null);
	const [roomRefresh, setRoomRefresh] = useState(false);

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			setRoom(response.data.data);
		});
	}, [roomId, roomRefresh]);

	const bookClickHandler = (book) => {
		navigate(`/room/${roomId}/book/${book.id}`);
	};

	return (
		<>
			{room && (
				<div>
					<h1>{room.title}</h1>
					<h2>책 목록</h2>
					<BookShelf books={room.Books} bookClickhandler={bookClickHandler} />
					<AddBook room={room} refresher={setRoomRefresh} />
				</div>
			)}
		</>
	);
};

export default RoomPage;
