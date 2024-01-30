import React, { useState, useEffect } from "react";
// import Book from "components/Book";
import RoomCard from "components/RoomCard";
import UploadFile from "./UploadFile";
import MakeRoom from "components/MakeRoom";
import FindRoom from "components/FindRoom";

// import "./style.css";

function Main() {
	return (
		<div>
			<MakeRoom />
			<FindRoom />
			<UploadFile />
		</div>
	);
}

export default Main;
