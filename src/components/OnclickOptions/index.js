import React, { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import InsertLink from "components/OptionsModal/InsertLink";
import AddMemo from "components/OnclickOptions/AddMemo";
import { useRecoilState } from "recoil";
import { userIdState } from "recoil/atom";

function OnclickOptions({
	isOpen,
	onClose,
	highlightId,
	bookId,
	selectedHighlightInfo,
	appendHighlightListItem,
	sendHighlightToServer,
	handleCreateHighlight,
	color,
}) {
	const [activeModal, setActiveModal] = useState(null);
	const [userId, setUserId] = useRecoilState(userIdState);

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
				<Button
					onClick={() => {
						onClose();
					}}
				>
					닫기
				</Button>
				<Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 2 }}>
					<Button variant="contained" onClick={() => openModal("Memo")}>
						메모 삽입
					</Button>
					<Button variant="contained" onClick={() => openModal("Link")}>
						링크 삽입
					</Button>
				</Box>

				{activeModal === "Memo" && (
					<AddMemo
						isOpen={true}
						onClose={closeModal}
						onCloseEntire={onClose}
						userId={userId}
						highlightId={highlightId}
						sendHighlightToServer={sendHighlightToServer}
						selectedHighlightInfo={selectedHighlightInfo}
						appendHighlightListItem={appendHighlightListItem}
						handleCreateHighlight={handleCreateHighlight}
					/>
				)}

				{activeModal === "Link" && (
					<InsertLink
						isOpen={true}
						onClose={closeModal}
						onCloseEntire={onClose}
						userId={userId}
						highlightId={highlightId}
						bookId={bookId}
					/>
				)}
			</Box>
		</Modal>
	);
}

export default OnclickOptions;
