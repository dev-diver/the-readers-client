import React, { useState } from "react";
import api from "api";
import { logger } from "logger";

const SearchChange = ({ setData }) => {
	const [bookname, setbookname] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();

		api
			.get(`/rooms/search?bookname=${encodeURIComponent(bookname)}`)
			.then((res) => {
				logger.log(res);
				setData(res.data.data);
			})
			.catch((error) => {
				logger.error("Error:", error);
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
