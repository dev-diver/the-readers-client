import React, { useEffect, useState } from "react";
import api from "api";
import { Box, Button, Typography, Modal } from "@mui/material";

function MarkerViewer({ isOpen, onClose, bookId, fromHighlightId, MyMarkers, onCloseEntire }) {
	// 클릭 이벤트 핸들러
	const handleComponentClick = async () => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("데이터 입니다", response.data.data);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	// 하이라이트 선택 핸들러
	const handleSelectHighlight = async (highlightId) => {
		const toHighlightId = highlightId;
		console.log("선택된 하이라이트 ID:", toHighlightId);
		try {
			const response = await api.post(`/link`, {
				fromHighlightId: fromHighlightId,
				toHighlightId: toHighlightId,
				note: "링크 설명", // 필요하다면 여기에 추가 정보를 포함시킬 수 있습니다.
			});
			console.log("링크 생성 성공:", response.data);
			// 성공 처리 로직 (예: 상태 업데이트, 사용자에게 알림 등)
			onClose();
			onCloseEntire();
		} catch (error) {
			console.error("링크 생성 실패:", error);
			// 실패 처리 로직 (예: 에러 메시지 표시 등)
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
		outline: "none",
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle} onClick={handleComponentClick} component="form" noValidate>
				{MyMarkers.map((highlight) => (
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

export default MarkerViewer;
