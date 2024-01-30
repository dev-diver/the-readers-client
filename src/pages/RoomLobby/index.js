import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import BookShelf from "components/BookShelf";
import api from "api";

const RoomPage = () => {
	const { roomId } = useParams();
	// const location = useLocation();
	// const [room, setRoom] = useState({ Books: [] });
	const [room, setRoom] = useState([]);
	useEffect(() => {
		api.get(`/rooms/${roomId}`).then((response) => {
			console.log("응답입니다.", response);
			setRoom(response.data.data);
		});
	}, [roomId]);
	return (
		<>
			{room && (
				<div>
					<h1>{room.title}</h1>
					<h2>책 목록</h2>
					<h3>{room.bookFile}</h3>
					{/* <BookShelf room={room} /> */}
				</div>
			)}
		</>
	);
};

export default RoomPage;
