import React from "react";
import Book from "components/Book";

const BookShelf = ({ room }) => {
	return (
		<ul>
			{room.Books.length != 0 ? (
				room.Books.map((book, index) => <Book key={index} roomId={room.id} book={book} />)
			) : (
				<div> 책이 아직 없어요.</div>
			)}
		</ul>
	);
};

export default BookShelf;
