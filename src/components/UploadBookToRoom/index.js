import React, { useState, useEffect } from "react";
import FormFile from "./Formfile";
import api from "api";
import { logger } from "logger";
import { PDF_UPLOAD_URL } from "config/config";

export default function UploadBookToRoom({ roomId, refresher, setPop }) {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");

	const uploadBook = (formData) => {
		const timestamp = Date.now();
		formData.append("fileName", `_${timestamp}`);

		api
			.post(`${PDF_UPLOAD_URL}/api/pdf`, formData)
			.then((response) => {
				logger.log(response.data);
				api
					.post(`/rooms/${roomId}/books`, {
						title: title || "제목없음",
						// location: response.data.location,
						fileName: response.data.fileName,
					})
					.then((response) => {
						logger.log(response.data.url);
						refresher((prev) => !prev);
						setPop(false);
					})
					.catch((err) => {
						logger.error(err);
					});
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
				<input accept="application/pdf" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
			</div>
			<div>
				<span>파일 업로드</span>
				<FormFile setFile={setFile} />
			</div>
			<button
				type="button"
				onClick={() => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("title", title);
					uploadBook(formData);
				}}
			>
				업로드!
			</button>
		</>
	);
}
