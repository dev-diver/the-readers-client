import React, { useState } from "react";
import api from "api";
import { Box, Button, Typography, Modal } from "@mui/material";
import { View } from "lucide-react";
import ViewMyMarker from "components/MarkerViewer";

function InsertInner({ isOpen, onClose, userId, highlightId, bookId }) {
	const [highlights, setHighlights] = useState([]);

	// 클릭 이벤트 핸들러
	// const handleComponentClick = async () => {
	// 	try {
	// 		const response = await api.get(`/highlights/book/${bookId}`);
	// 		console.log("데이터 입니다", response.data.data.data);
	// 		setHighlights(response.data.data); // 상태 업데이트
	// 	} catch (error) {
	// 		console.error("Failed to fetch highlights", error);
	// 	}
	// };

	// 하이라이트 선택 핸들러
	const handleSelectHighlight = async (highlightId) => {
		console.log("선택된 하이라이트 ID:", highlightId);
		// try {
		// 	const response = await api.post(`link/${highlightId}`);
		// }
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
		outline: "none",
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle} component="form" noValidate>
				{highlights.map((highlight) => (
					<Box key={highlight.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
						<Typography variant="body1">{highlight.text}</Typography>
						<Button variant="outlined" onClick={() => handleSelectHighlight(highlight.id)}>
							선택
						</Button>
					</Box>
				))}
			</Box>
		</Modal>
	);
}

export default InsertInner;
