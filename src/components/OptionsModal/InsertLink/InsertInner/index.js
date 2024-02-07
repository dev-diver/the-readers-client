import React, { useEffect, useState } from "react";
import api from "api";
import { Box, Button, TextField, Typography, Modal, FormControl } from "@mui/material";

function InsertInner({ isOpen, onClose, userId, highlightId, bookId }) {
	const [OuterLink, setOuterLink] = useState("");
	const [highlights, setHighlights] = useState([]);

	const fetchHighlights = async () => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("데이터 입니다", response.data.data);
			setHighlights(response.data.data);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	useEffect(() => {
		fetchHighlights();
	}, []);

	// const handleSubmit = async (e) => {
	// 	e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
	// 	try {
	// 		const response = await api.post(`/outerlinks`, {
	// 			highlightId: highlightId,
	// 			OuterLink: OuterLink,
	// 		});
	// 		console.log("외부 링크 삽입 성공", response.data.data);
	// 		onClose();
	// 		setOuterLink("");
	// 	} catch (error) {
	// 		console.error("외부 링크 삽입 실패", error);
	// 	}
	// };

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		outline: "none", // 모달 포커스 시 아웃라인 제거
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle} component="form" /*onSubmit={handleSubmit}*/ noValidate>
				{/* <Typography id="modal-modal-title" variant="h6" component="h2">
					외부 링크 삽입
				</Typography>
				<FormControl fullWidth margin="normal">
					<TextField
						autoFocus
						margin="dense"
						id="memo"
						label="메모"
						type="text"
						fullWidth
						variant="outlined"
						value={OuterLink}
						onChange={(e) => setOuterLink(e.target.value)}
					/>
				</FormControl>
				<Box mt={2} display="flex" justifyContent="space-between">
					<Button variant="outlined" onClick={onClose}>
						취소
					</Button>
					<Button type="submit" variant="contained">
						제출
					</Button>
				</Box> */}
				{highlights.map((highlight) => {
					return (
						<div key={highlight.id}>
							<p>{highlight.text}</p>
						</div>
					);
				})}
			</Box>
		</Modal>
	);
}

export default InsertInner;
