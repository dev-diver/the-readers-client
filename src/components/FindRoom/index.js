import React, { useState } from "react";
import api from "api";
import RoomCard from "components/RoomCard";

function FindRoom() {
	const [bookName, setBookName] = useState("");
	const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

	const handleSearch = async () => {
		try {
			const response = await api.get("/rooms/search", {
				params: { bookname: bookName },
			});
			setSearchResults(response.data); // 검색 결과를 상태에 저장
			console.log("검색 결과:", response.data);
		} catch (error) {
			console.error("검색 중 에러 발생", error.message);
		}
	};

	return (
		<div>
			<input type="text" value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="책 이름 검색" />
			<button onClick={handleSearch}>Search</button>
			{searchResults && (
				<div>
					{/* {searchResults.map((room, index) => (
						<div key={index}>{room.title}</div>
					))} */}
					{searchResults.map((room, index) => (
						<RoomCard key={index} room={room} /> // 각 방에 대해 RoomCard 컴포넌트를 렌더링합니다.
					))}
				</div>
			)}
		</div>
	);
}

export default FindRoom;
