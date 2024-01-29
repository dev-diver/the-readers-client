import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Book({ roomId, book }) {
	const url = roomId ? `/room/${roomId}/book/${book.id}` : `/book/${book.id}`;

	return (
		<li>
			<Link to={url}>{book.name}</Link>
		</li>
	);
}

export default Book;
