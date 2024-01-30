import React, { useState, useEffect } from "react";
// import Book from "components/Book";
import RoomCard from "components/RoomCard";
import SearchForm from "components/SearchForm";
import UploadFile from "./UploadFile";
import MakeRoom from "components/MakeRoom";
import FindRoom from "components/FindRoom";
// import { logger } from "logger";
// import "./style.css";

function Main() {
	const [rooms, setRoom] = useState([]);
	const [books, setBooks] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);
	const [bookList, setBookList] = useState([]);

	useEffect(() => {
		const newData = rooms.map((room, i) => {
			return <RoomCard key={i} room={room} />;
		});
		setStudyroomList(newData);
	}, [rooms]);

	useEffect(() => {
		const newData = books.map((book, i) => {
			return <></>;
		});
		setBookList(newData);
	}, [books]);

	return (
		<div>
			{/* <div className="mainpage-book">
				<SearchForm setData={setRoom} mode="room" />
				<div className="search-result">
					<div className="div">{studyroomList}</div>
				</div>
				<UploadFile />
			</div>
			<div className="mainpage-book">
				<SearchForm setData={setBooks} mode="book" />
				<div className="search-result">
					<div className="div">{bookList}</div>
				</div>
				<UploadFile />
			</div> */}
			<MakeRoom />
			<FindRoom />
		</div>
	);
}

export default Main;
