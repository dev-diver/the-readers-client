import React from "react";
import "./style.css";

function BookCard({ book, bookId, handler }) {
	const isCurrentBook = book.id === Number(bookId);
	return (
		<li key={book.id} className="book-card" onClick={handler}>
			{book.name}
			{isCurrentBook && " (현재 책)"}
		</li>
	);
}

export default BookCard;
