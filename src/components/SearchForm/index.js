import React, { useState } from "react";
import api from "api";
import { logger } from "logger";

const SearchForm = ({ setData, mode }) => {
	const [bookname, setbookname] = useState("");

	const searchBooks = (event) => {
		event.preventDefault();

		api
			.get(`/books/search/?bookname=${encodeURIComponent(bookname)}`)
			.then((res) => {
				logger.log(res);
				if (res.data.data && res.data.data.length === 0) {
					// 빈 배열이 반환된 경우
					logger.log("검색 결과가 없습니다.");
					setData([]);
				} else {
					// 검색 결과가 있는 경우
					setData(res.data.data);
				}
			})
			.catch((error) => {
				logger.error("Error:", error);
			});
	};

	const searchRooms = (event) => {
		event.preventDefault();

		api
			.get(`/rooms/search/?bookname=${encodeURIComponent(bookname)}`)
			.then((res) => {
				logger.log(res);
				if (res.data.data && res.data.data.length === 0) {
					// 빈 배열이 반환된 경우
					logger.log("검색 결과가 없습니다.");
					setData([]);
				} else {
					// 검색 결과가 있는 경우
					setData(res.data.data);
				}
			})
			.catch((error) => {
				logger.error("Error:", error);
			});
	};

	return (
		<div id="searchChange">
			<form onSubmit={mode == "room" ? searchRooms : searchBooks}>
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

export default SearchForm;
