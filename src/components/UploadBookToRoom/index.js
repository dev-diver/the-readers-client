import React, { useState, useEffect } from "react";
import FormFile from "./Formfile";
import api from "api";
import { logger } from "logger";
import { PDF_UPLOAD_URL } from "config/config";
import { LoadingButton } from "@mui/lab";
import { TextField, Typography, Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image"; // 이미지 아이콘 추가

export default function UploadBookToRoom({ roomId, refresher, setPop }) {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null); // 이미지 파일 상태 추가
	const [imagePreview, setImagePreview] = useState(""); // 이미지 미리보기 URL 상태 추가

	const handleImageChange = (e) => {
		// 이미지 변경 핸들러 함수
		const file = e.target.files[0];
		if (file) {
			setImage(file);
			setImagePreview(URL.createObjectURL(file)); // 미리보기 URL 생성
		}
	};

	const uploadBook = (e) => {
		e.preventDefault();

		// 이미지, 책 이름, 책 파일이 제공되었는지 확인
		if (!image || title.trim() === "" || !file) {
			alert("이미지, 책 이름, 책 파일을 모두 업로드해주세요.");
			return; // 필수 항목이 누락된 경우 함수 실행을 중단
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		// formData.append("image", image); // 변수명 이미지로 formData에 태웠습니다.

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
				{imagePreview && (
					<Box mt={2} textAlign="center">
						<Typography>북 커버 미리 보기</Typography>
						<img src={imagePreview} alt="Preview" style={{ maxWidth: "50%", height: "auto" }} />
					</Box>
				)}
				<Button type="button" component="label" variant="contained" startIcon={<ImageIcon />}>
					이미지 추가
					<input type="file" hidden onChange={handleImageChange} accept="image/*" />
				</Button>
				<Box mt={2}>
					<Typography component="h3">책 추가하기</Typography>
				</Box>

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
