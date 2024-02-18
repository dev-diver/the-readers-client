import React from "react";
import BookCard from "components/BookShelf/BookCard";
import { Box } from "@mui/material";

const BookShelf = ({ books, bookId, bookClickhandler }) => {
	return (
		<Box className="book-card-container">
			{books.length != 0 ? (
				books.map((book, index) => (
					<BookCard key={index} index={index} book={book} bookId={bookId} handler={() => bookClickhandler(book)} />
				))
			) : (
				<div> 책이 아직 없어요.</div>
			)}
		</Box>
	);
};

export default BookShelf;
