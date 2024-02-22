import React, { useState } from "react";
import api from "api";
import BookCard from "components/BookShelf/BookCard";
import { TextField, Button, Box } from "@mui/material";
import { Search } from "lucide-react";

function FindBook({ bookClickHandler }) {
	const [bookName, setBookName] = useState("");
	const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

	const handleSearch = async () => {
		// 책 이름이 비어 있는 경우 alert을 표시하고 함수를 종료
		if (!bookName.trim()) {
			alert("책 이름을 입력해주세요.");
			return;
		}

		api
			.get("/books", {
				params: { bookname: bookName },
			})
			.then((response) => {
				console.log("검색 결과:", response.data);
				setSearchResults(response.data.data); // 검색 결과를 상태에 저장
			})
			.catch((error) => {
				// 서버로부터 받은 오류 메시지를 확인하고 알림을 띄움
				if (error.response?.status === 404) {
					alert(error.response?.data?.message);
				} else {
					console.error(error.response?.data?.message);
				}
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
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				{" "}
				{/* 스타일 추가 */}
				<TextField
					type="text"
					value={bookName}
					onChange={(e) => setBookName(e.target.value)}
					placeholder="책 검색"
					// fullWidth // TextField를 전체 너비로 설정
					sx={{
						".MuiInputBase-input": { height: 20, padding: "10px" }, // 입력 필드 내부의 높이와 패딩 조정
					}}
				/>
				<Button variant="contained" type="submit">
					<Search />
				</Button>
			</Box>
			<div>
				{searchResults.map((book, index) => (
					<BookCard key={index} book={book} handler={() => bookClickHandler(book)} />
				))}
			</div>
		</form>
	);
}

export default FindBook;
