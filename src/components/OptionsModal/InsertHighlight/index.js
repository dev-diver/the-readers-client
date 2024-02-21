import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import api from "api";

function InsertHighlight({ isOpen, onClose, userId }) {
	const [description, setDescription] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await api.post(`/highlights/user/${userId}/create`, {
				description,
			});
			console.log("하이라이트 생성 성공", response.data);
			onClose();
			setDescription("");
		} catch (error) {
			console.error("하이라이트 생성 실패", error);
		}
	};

	return (
		<Modal open={isOpen} onClose={onClose}>
			<Box
				sx={
					{
						/* modalStyle */
					}
				}
				component="form"
				onSubmit={handleSubmit}
			>
				<Typography variant="h6">하이라이트 생성</Typography>
				<TextField
					autoFocus
					margin="dense"
					id="description"
					label="설명"
					type="text"
					fullWidth
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<Button type="submit">생성</Button>
				<Button onClick={onClose}>취소</Button>
			</Box>
		</Modal>
	);
}

export default InsertHighlight;
