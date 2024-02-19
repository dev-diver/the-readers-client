import React, { useState, useEffect } from "react";
import FormFile from "./Formfile";
import api from "api";
import { logger } from "logger";
import { PDF_UPLOAD_URL } from "config/config";
import { LoadingButton } from "@mui/lab";
import { TextField, Typography, Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function UploadBookToRoom({ roomId, refresher, setPop }) {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);

	const uploadBook = (e) => {
		setLoading(true);
		e.preventDefault();
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		const timestamp = Date.now();
		formData.append("fileName", `_${timestamp}`);
		console.log("url", `${PDF_UPLOAD_URL}/api/pdf`);
		api
			.post(`${PDF_UPLOAD_URL}/api/pdf`, formData)
			.then((response) => {
				logger.log(response.data);
				api
					.post(`/rooms/${roomId}/books`, {
						title: title || "제목없음",
						fileName: response.data.fileName,
						totalPage: response.data.totalPage,
					})
					.then((response) => {
						logger.log(response.data.url);
						refresher((prev) => !prev);
						setPop(false);
					})
					.catch((err) => {
						logger.error(err);
						throw Error();
					})
					.finally(() => {
						setLoading(false);
					});
			})
			.catch((err) => {
				logger.error(err);
				setLoading(false);
			});
	};

	return (
		<>
			<Box component="form" onSubmit={uploadBook}>
				<Typography component="h3">책 추가</Typography>
				<TextField fullWidth label="책 이름" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
				<TextField disabled fullWidth label="책 파일" value={file?.name || ""} />
				<Button type="button" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
					파일 추가
					<FormFile setFile={setFile} />
				</Button>
				<LoadingButton loading={loading} type="submit" variant="contained">
					업로드
				</LoadingButton>
			</Box>
		</>
	);
}
