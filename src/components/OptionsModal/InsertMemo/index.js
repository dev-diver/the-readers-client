import React, { useState } from "react";
import api from "api";
import { Box, Button, TextField, Typography, Modal, FormControl } from "@mui/material";

function InsertMemo({ isOpen, onClose, handleCreateHighlight }) {
	const [memo, setMemo] = useState("");

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
			<Box sx={modalStyle} component="form" onSubmit={(e) => handleCreateHighlight(e, memo)} noValidate>
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

export default InsertMemo;
