import React, { useState } from "react";
import { baseURL } from "config/config";

const SearchChange = ({ setData }) => {
	const [bookname, setbookname] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();

		fetch(`${baseURL}/api/books/search?bookname=${encodeURIComponent(bookname)}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setData(data.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	return (
		<div id="searchChange">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="책 제목을 입력해주세요"
					value={bookname}
					onChange={(e) => setbookname(e.target.value)}
					required
				></input>
				<button type="submit">입력</button>
			</form>
		</div>
	);
};

export default SearchChange;
