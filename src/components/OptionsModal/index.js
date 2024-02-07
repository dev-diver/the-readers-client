import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import InsertHighlight from "./InsertHighlight";
import { InfoToRange, drawHighlight } from "pages/Room/PDFViewer/Highlights/util";
import api from "api";
import { logger } from "logger";
import socket from "socket.js";

import InsertMemo from "./InsertMemo";
import InsertLink from "./InsertLink";

// 세 가지의 옵션 제공 : 하이라이트 생성, 메모 삽입, 링크 삽입
function OptionsModal({
	isOpen,
	onClose,
	userId,
	highlightId,
	bookId,
	roomId,
	selectedHighlightInfo,
	appendHighlightListItem,
	color = "yellow", // 하이라이트 색상 기본값 설정
}) {
	// activeModal 상태를 통해 어떤 모달을 띄울지 결정함
	// 선택지 : "Highlight", "Memo", "Link", null(아무 것도 띄우지 않음)
	const [activeModal, setActiveModal] = useState(null);

	// 모달 열기 : activeModal에 선택지 중 하나의 modalType을 줌
	const openModal = (modalType) => {
		setActiveModal(modalType);
	};

	// 모달 닫기 : activeModal에 null을 줌
	const closeModal = () => {
		setActiveModal(null);
	};

	// 하이라이트 생성 버튼 클릭 핸들러
	const handleCreateHighlight = () => {
		if (selectedHighlightInfo) {
			// 화면에 하이라이트 그리기
			drawHighlight(InfoToRange(selectedHighlightInfo), {
				id: new Date().getTime(), // 예시로 유니크 ID 생성, 실제 구현에서는 서버에서 받은 ID 사용
				userId: userId,
				color: "yellow", // 색상은 상황에 맞게 설정
			});

			// 하이라이트 목록에 추가
			appendHighlightListItem({
				...selectedHighlightInfo,
				id: new Date().getTime(), // 실제 구현에서는 서버에서 받은 ID 사용
			});

			onClose(); // 모달 닫기
		}
	};

	// const handleCreateHighlight = async () => {
	// 	console.log("핸들핸들");
	// 	if (selectedHighlightInfo && userId && bookId) {
	// 		try {
	// 			const response = await api.post(`/highlights/user/${userId}`, {
	// 				...selectedHighlightInfo,
	// 				bookId: bookId,
	// 				color: color,
	// 			});
	// 			const highlightId = response.data.highlightId; // 서버에서 반환한 하이라이트 ID

	// 			const highlightInfoWithId = {
	// 				...selectedHighlightInfo,
	// 				id: highlightId,
	// 			};

	// 			// 화면에 하이라이트 그리기 (정확한 highlightId 사용)
	// 			drawHighlight(InfoToRange(highlightInfoWithId), {
	// 				id: highlightId,
	// 				userId: userId,
	// 				color: color,
	// 			});

	// 			// 하이라이트 목록에 추가
	// 			appendHighlightListItem(highlightInfoWithId);

	// 			// 소켓을 통해 다른 클라이언트에 하이라이트 생성 정보 전송
	// 			socket.emit("insert-highlight", {
	// 				...highlightInfoWithId,
	// 				roomId: roomId,
	// 			});

	// 			onClose(); // 모달 닫기, 올바른 위치에 있음
	// 		} catch (error) {
	// 			console.error("Failed to create highlight:", error);
	// 		}
	// 	}
	// };

	// 모달 스타일 : 그냥 챗지피티에서 따옴
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
					<Button variant="contained" onClick={handleCreateHighlight}>
						하이라이트 생성
					</Button>
					<Button variant="contained" onClick={() => openModal("Memo")}>
						메모 삽입
					</Button>
					<Button variant="contained" onClick={() => openModal("Link")}>
						링크 삽입
					</Button>
				</Box>

				{activeModal === "Highlight" && (
					<InsertHighlight
						isOpen={true}
						onClose={closeModal}
						userId={userId}
						highlightId={highlightId}
						drawHighlight={drawHighlight}
						appendHighlightListItem={appendHighlightListItem}
						selectedHighlightInfo={selectedHighlightInfo}
					/>
				)}

				{activeModal === "Memo" && (
					<InsertMemo isOpen={true} onClose={closeModal} userId={userId} highlightId={highlightId} />
				)}

				{activeModal === "Link" && (
					<InsertLink isOpen={true} onClose={closeModal} userId={userId} highlightId={highlightId} bookId={bookId} />
				)}
			</Box>
		</Modal>
	);
}

export default OptionsModal;
