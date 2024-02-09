import React, { useState, useEffect } from "react";
import FormFile from "./Formfile";
import api from "api";
import { logger } from "logger";
import { Button } from "@mui/material";

export default function UploadBookToRoom({ roomId, refresher, setPop }) {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");

	const uploadBook = (formData) => {
		api
			.post(`/rooms/${roomId}/books`, formData)
			.then((response) => {
				logger.log(response.data.url);
				refresher((prev) => !prev);
				setPop(false);
			})
			.catch((err) => {
				logger.error(err);
			});
	};

	return (
		<>
			<h3>책 추가</h3>
			<div>
				<span>책 이름</span>
				<input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
			</div>
			<div>
				<span>파일 업로드</span>
				<FormFile setFile={setFile} />
			</div>
			<Button
				type="button"
				onClick={() => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("fileName", fileName);
					uploadBook(formData);
				}}
			>
				업로드!
			</Button>
		</>
	);
}
