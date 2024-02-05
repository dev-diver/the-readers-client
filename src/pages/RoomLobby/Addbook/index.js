import React from "react";
import UploadBookToRoom from "components/UploadBookToRoom";
import FindBook from "components/FindBook";
import PopUp from "components/PopUp";
import { useState } from "react";
import api from "api";

const AddBook = ({ room, refresher }) => {
	const [pop, setPop] = useState(false);
	const bookClickHandler = (book) => {
		api
			.post(`/rooms/${room.id}/books/${book.id}`, {})
			.then((response) => {
				console.log(response.data);
				if (response.status === 200) {
					refresher((prev) => !prev);
					setPop(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<>
			<button onClick={() => setPop(true)}>책 추가</button>
			<PopUp isOpen={pop} onClose={() => setPop(false)}>
				<FindBook bookClickHandler={bookClickHandler} />
				<UploadBookToRoom roomId={room.id} setPop={setPop} refresher={refresher} />
			</PopUp>
		</>
	);
};

export default AddBook;
