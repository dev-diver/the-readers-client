import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BookShelf from "components/BookShelf";
import api from "api";

const RoomPage = () => {
	const { roomId } = useParams();
	const [room, setRoom] = useState({ Books: [] });

	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			setRoom(response.data.data);
		});
	}, []);

	return (
		<>
			{room && (
				<div>
					<h1>{room.name}</h1>
					<h2>책 목록</h2>
					<BookShelf room={room} />
				</div>
			)}
		</>
	);
};

export default RoomPage;
