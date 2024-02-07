import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import api from "api";
import InsertInner from "./InsertInner";
import InsertOuter from "./InsertOuter";

function InsertLink({ isOpen, onClose, userId, highlightId, bookId }) {
	const [activeModal, setActiveModal] = useState(null);

	const openModal = (modalType) => {
		setActiveModal(modalType);
	};

	const closeModal = () => {
		setActiveModal(null);
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
		<Modal open={isOpen} onClose={onClose}>
			<Box sx={modalStyle}>
				<Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 2 }}>
					<Button variant="contained" onClick={() => openModal("InsertInner")}>
						내부 링크 생성
					</Button>
					<Button variant="contained" onClick={() => openModal("InsertOuter")}>
						외부 링크 생성
					</Button>
				</Box>

				{activeModal === "InsertInner" && (
					<InsertInner isOpen={true} onClose={closeModal} userId={userId} highlightId={highlightId} bookId={bookId} />
				)}

				{activeModal === "InsertOuter" && (
					<InsertOuter isOpen={true} onClose={closeModal} userId={userId} highlightId={highlightId} />
				)}
			</Box>
		</Modal>
	);
}

export default InsertLink;
