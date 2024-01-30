import React, { useState, useEffect } from "react";
import Book from "components/Book";
import RoomCard from "components/RoomCard";

import SearchChange from "components/SearchChange";
import UploadFile from "./UploadFile";

// import "./style.css";

function Main() {
	const [data, setData] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);

	useEffect(() => {
		const newData = data.map((room, i) => {
			return <RoomCard key={i} room={room} />;
		});
		setStudyroomList(newData);
	}, [data]);

	useEffect(() => {
		console.log("data changed");
		const newData = data.map((e, i) => {
			return <Book key={i} name={e.name} id={e.id}></Book>;
		});
		setStudyroomList(newData);
	}, [data]);

	return (
		<div className="mainpage-book">
			<SearchChange setData={setData} />
			<div className="search-result">
				<div className="div">{studyroomList}</div>
			</div>
			<UploadFile />
		</div>
	);
}

export default Main;
