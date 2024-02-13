import React, { useState } from "react";
import api from "api";
import { Box, Button, TextField, Typography, Modal, FormControl } from "@mui/material";

function AddMemo({ isOpen, onClose, highlightId, userId, onCloseEntire }) {
	const [memo, setMemo] = useState("");
	// 메모 추가
	const addMemo = async (e, memo) => {
		e.preventDefault(); // 폼 제출의 기본 동작 방지
		console.log(highlightId, memo);
		try {
			const response = await api.put(`/highlights/user/${userId}/memo`, {
				highlightId,
				memo,
			});
			console.log("메모 생성 성공:", response.data);
			onClose(); // 모달 닫기
			onCloseEntire(); // 상위 컴포넌트의 모달 닫기
		} catch (error) {
			console.error("Failed to create highlight", error);
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
			<Box sx={modalStyle} component="form" onSubmit={(e) => addMemo(e, memo)} noValidate>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					메모 삽입
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
						value={memo}
						onChange={(e) => setMemo(e.target.value)}
					/>
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

export default AddMemo;
