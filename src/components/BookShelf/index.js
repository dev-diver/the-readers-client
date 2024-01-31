import React from "react";
import BookCard from "components/BookShelf/BookCard";

const BookShelf = ({ books, bookClickhandler }) => {
	return (
		<ul>
			{books.length != 0 ? (
				books.map((book, index) => <BookCard key={index} book={book} handler={() => bookClickhandler(book)} />)
			) : (
				<div> 책이 아직 없어요.</div>
			)}
		</ul>
	);
};

export default BookShelf;
