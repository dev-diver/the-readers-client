import React from "react";
import "./style.css";

function BookCard({ book, handler }) {
	return <li onClick={handler}>{book.name}</li>;
}

export default BookCard;
