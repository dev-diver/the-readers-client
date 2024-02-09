import React from "react";
import BookCard from "components/BookShelf/BookCard";

const BookShelf = ({ books, bookId, bookClickhandler }) => {
	return (
		<ul className="book-card-container">
			{books.length != 0 ? (
				books.map((book, index) => (
					<BookCard key={index} book={book} bookId={bookId} handler={() => bookClickhandler(book)} />
				))
			) : (
				<div> 책이 아직 없어요.</div>
			)}
		</ul>
	);
};

export default BookShelf;
