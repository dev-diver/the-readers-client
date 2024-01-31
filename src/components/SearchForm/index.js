import React, { useState } from "react";
import api from "api";
import { logger } from "logger";

const SearchForm = ({ setData, mode }) => {
	const [bookname, setbookname] = useState("");

	const searchBooks = (event) => {
		event.preventDefault();

		api
			.get(`/books`, {
				params: { bookname: bookname },
			})
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
			.get(`/room/?bookname=${encodeURIComponent(bookname)}`)
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

	const submitHandler = mode == "room" ? searchRooms : searchBooks;
	const placeholder = mode == "room" ? "방 이름을 입력해주세요" : "방 또는 책 이름을 입력해주세요";

	return (
		<div id="searchForm">
			<form onSubmit={submitHandler}>
				<input
					type="text"
					placeholder={placeholder}
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
