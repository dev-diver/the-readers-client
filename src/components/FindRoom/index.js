import React, { useState } from "react";
import api from "api";
import RoomCard from "./RoomCard";

function FindRoom() {
	const [name, setName] = useState("");
	const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

	const handleSearch = () => {
		api
			.get("/rooms", {
				params: { name: name },
			})
			.then((response) => {
				setSearchResults(response.data.data); // 검색 결과를 상태에 저장
				console.log("검색 결과:", response.data.data);
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
			<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="방/책 이름 검색"></input>
			<button type="submit">Search</button>
			<div>
				{searchResults.map((room, index) => (
					<RoomCard key={index} room={room} />
				))}
			</div>
		</form>
	);
}

export default FindRoom;
