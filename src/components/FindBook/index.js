import React, { useState } from "react";
import api from "api";
import BookCard from "components/BookShelf/BookCard";
import { TextField, Button } from "@mui/material";
import { Search } from "lucide-react";

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
				console.error(error.response?.data?.message);
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
			<div>
				<TextField type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="책 검색" />
				<Button variant="contained" type="submit">
					{/* 검색 아이콘 */}
					<Search />
				</Button>
			</div>
			<div>
				{searchResults.map((book, index) => (
					<BookCard key={index} book={book} handler={() => bookClickHandler(book)} />
				))}
			</div>
		</form>
	);
}

export default FindBook;
