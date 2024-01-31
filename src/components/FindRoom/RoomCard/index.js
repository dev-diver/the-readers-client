import React from "react";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
	return (
		<div className="card">
			<Link to={`/room/${room.id}`}>
				<h2>{room.title}</h2>
			</Link>
			<div>{room.Books?.map((book, i) => <span key={i}>{book.name}</span>) || <></>}</div>
		</div>
	);
};

export default RoomCard;
