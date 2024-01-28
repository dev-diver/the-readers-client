import React, { useState, useEffect } from "react";
import Book from "components/Book";
import SearchChange from "components/SearchChange";
import UploadFile from "./UploadFile";
import { logger } from "logger";

// import "./style.css";

function Main() {
	const [data, setData] = useState([]);
	const [studyroomList, setStudyroomList] = useState([]);

	useEffect(() => {
		logger.log("data changed");
		const newData = data.map((e, i) => {
			return <Book key={`book-${i}`} name={e.name} id={e.id}></Book>;
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
