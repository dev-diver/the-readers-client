import React from "react";
import { Link } from "react-router-dom";
import Book from "components/Book";
import BookShelf from "components/BookShelf";

const RoomCard = ({ room }) => {
	console.log("room입니다!!", room);
	return (
		<div className="card">
			<Link to={`/room/${room.id}`}>
				<h2>{room.title}</h2>
			</Link>

			{/* <BookShelf room={room} /> */}
		</div>
	);
};

export default RoomCard;
