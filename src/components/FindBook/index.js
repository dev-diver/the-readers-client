import React, { useState } from "react";
import api from "api";
import BookCard from "components/BookShelf/BookCard";

function FindBook({ bookClickHandler }) {
	const [bookName, setBookName] = useState("");
	const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

	const handleSearch = async () => {
		api
			.get("/books", {
				params: { bookname: bookName },
			})
			.then((response) => {
				console.log("검색 결과:", response.data);
				setSearchResults(response.data.data); // 검색 결과를 상태에 저장
			})
			.catch((error) => {
				console.error("검색 중 에러 발생", error.message);
			});
	};

	return (
		<form
			id="searchForm"
			onSubmit={(e) => {
				e.preventDefault();
				handleSearch();
			}}
		>
			<input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="책 검색" />
			<button type="submit">Search</button>
			<div>
				{searchResults.map((book, index) => (
					<BookCard key={index} book={book} handler={() => bookClickHandler(book)} />
				))}
			</div>
		</form>
	);
}

export default FindBook;
