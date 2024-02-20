import React from "react";
import UploadBookToRoom from "components/UploadBookToRoom";
import FindBook from "components/FindBook";
import PopUp from "components/PopUp";
import { useState } from "react";
import api from "api";
import { Button, Grid } from "@mui/material";

const AddBook = ({ room, refresher, className }) => {
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
	const togglePop = () => {
		setPop(!pop);
	};

	return (
		<div className={className || ""}>
			<Grid container direction="column" spacing={2} cursor="auto">
				<Grid item>
					<Button variant="contained" onClick={togglePop}>
						{pop ? "닫기" : "책 추가"}
					</Button>
				</Grid>
				<Grid item>
					<PopUp isOpen={pop} onClose={() => setPop(false)}>
						<FindBook bookClickHandler={bookClickHandler} />
						<UploadBookToRoom roomId={room?.id} setPop={setPop} refresher={refresher} />
					</PopUp>
				</Grid>
			</Grid>
		</div>
	);
};

export default AddBook;
