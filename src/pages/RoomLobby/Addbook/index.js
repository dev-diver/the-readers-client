import React from "react";
import UploadFile from "components/UploadFile";
import FindBook from "components/FindBook";
import api from "api";

const AddBook = ({ room, refresh, onClose }) => {
	const bookClickHandler = (book) => {
		console.log(book);
		api
			.post(`/rooms/${room.id}/books/${book.id}`, {})
			.then((response) => {
				console.log(response.data);
				if (response.status === 200) {
					refresh((prev) => !prev);
					onClose();
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<FindBook bookClickHandler={bookClickHandler} />
			<UploadFile />
		</div>
	);
};

export default AddBook;
