import React from "react";
import Book from "components/Book";

const BookShelf = ({ room }) => {
	return (
		<ul>
			{room.Books.map((book, index) => (
				<Book key={index} roomId={room.id} book={book} />
			))}
		</ul>
	);
};

export default BookShelf;
