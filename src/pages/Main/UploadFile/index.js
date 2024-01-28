import React, { useState } from "react";
import FormFile from "./Formfile";
import api from "api";
import { logger } from "logger";

export default function UploadFile() {
	const [file, setFile] = useState(null);

	const uploadS3 = (formData) => {
		api
			.post("/storage", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {
				logger.log(response.data.url);
			})
			.catch((err) => {
				logger.error(err);
			});
	};

	return (
		<>
			<FormFile setFile={setFile} />
			<button
				type="button"
				onClick={() => {
					const formData = new FormData();
					formData.append("file", file);
					uploadS3(formData);
				}}
			>
				업로드!
			</button>
		</>
	);
}
