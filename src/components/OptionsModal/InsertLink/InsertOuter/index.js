import React, { useState } from "react";
import api from "api";
import { Box, Button, TextField, Typography, Modal, FormControl, Fade } from "@mui/material";

function InsertOuter({ isOpen, onClose, userId, highlightId, onCloseEntire }) {
	const [OuterLink, setOuterLink] = useState("");
	const [note, setNote] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
		try {
			const response = await api.post(`/outerlinks`, {
				highlightId: highlightId,
				OuterLink: OuterLink,
				note: note,
			});
			console.log("외부 링크 삽입 성공", response.data.data);
			onClose();
			onCloseEntire();
			setOuterLink("");
			setNote("");
		} catch (error) {
			console.error("외부 링크 삽입 실패", error);
		}
	};

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
			<Box sx={modalStyle} component="form" onSubmit={handleSubmit} noValidate>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					외부 링크 삽입
				</Typography>
				<FormControl fullWidth margin="normal">
					<TextField
						autoFocus
						margin="dense"
						id="memo"
						label="외부 링크"
						type="text"
						fullWidth
						variant="outlined"
						value={OuterLink}
						onChange={(e) => setOuterLink(e.target.value)}
					/>
					<Fade in={!!OuterLink} timeout={500}>
						{/*페이드인 효과 부여 및 외부링크 입력 시에만 노트 입력창 노출*/}
						<TextField
							margin="dense"
							id="link-note"
							label="링크 메모"
							type="text"
							fullWidth
							variant="outlined"
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					</Fade>
				</FormControl>
				<Box mt={2} display="flex" justifyContent="space-between">
					<Button variant="outlined" onClick={onClose}>
						취소
					</Button>
					<Button type="submit" variant="contained">
						제출
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default InsertOuter;
