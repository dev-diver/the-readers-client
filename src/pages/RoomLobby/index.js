import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import BookShelf from "components/BookShelf";
import api from "api";
import AddBook from "./Addbook";
import PopUp from "components/PopUp";

const RoomPage = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const [room, setRoom] = useState(null);
	const [roomRefresh, setRoomRefresh] = useState(false);
	const [pop, setPop] = useState(false);

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
					<button onClick={() => setPop(true)}>책 추가</button>
					<PopUp isOpen={pop} onClose={() => setPop(false)}>
						<AddBook room={room} refresh={setRoomRefresh} onClose={() => setPop(false)} />
					</PopUp>
				</div>
			)}
		</>
	);
};

export default RoomPage;
