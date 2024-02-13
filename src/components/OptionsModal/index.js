import React, { useState, useEffect } from "react";
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
	user,
	userId,
	highlightId,
	bookId,
	roomId,
	setHighlightId,
	selectedHighlightInfo,
	appendHighlightListItem,
	color = "yellow", // 하이라이트 색상 기본값 설정
}) {
	const [InsertMemoOpen, setInsertMemoOpen] = useState(false);

	const sendHighlightToServer = async (highlightInfo) => {
		console.log("user", user, "하이라이트 정보", highlightInfo);
		if (!user) {
			return null; // 세미콜론은 여기서 선택적이지만, 명확성을 위해 사용할 수 있습니다.
		}
		// ER_DATA_TOO_LONG 에러 방지를 위해 텍스트 길이 제한
		// WARN_DATA_TRUNCATED 에러 방지를 위해 텍스트 길이 제한
		const MAX_TEXT_LENGTH = 255; // 서버에서 허용하는 최대 길이
		if (highlightInfo.text && highlightInfo.text.length > MAX_TEXT_LENGTH) {
			highlightInfo.text = highlightInfo.text.substring(0, MAX_TEXT_LENGTH);
		}

		return api
			.post(`/highlights/user/${userId}`, highlightInfo)
			.then((response) => {
				logger.log(response);
				const highlightId = response.data.data[0].HighlightId;
				setHighlightId(highlightId);
				return highlightId;
			})
			.catch((err) => {
				logger.log(err);
				return null; // 에러 처리 후, 명시적으로 null 반환
			}); // Promise 체인이 끝나는 곳에 세미콜론 사용
	};

	// 하이라이트 생성 버튼 클릭 핸들러
	const handleCreateHighlight = (event, memo) => {
		event.preventDefault();
		if (selectedHighlightInfo) {
			selectedHighlightInfo.forEach(async (highlightInfo) => {
				const newRange = InfoToRange(highlightInfo);
				highlightInfo = {
					...highlightInfo,
					memo: memo,
				};
				const highlightId = await sendHighlightToServer(highlightInfo); // 형광펜 서버로 전송
				console.log("하이라이트 아이디입니다.", highlightId);
				const drawHighlightInfo = {
					id: highlightId,
					userId: userId,
					color: color,
					bookId: bookId,
				};
				highlightInfo = {
					...highlightInfo,
					...drawHighlightInfo,
				};
				socket.emit("insert-highlight", highlightInfo); //소켓에 전송
				drawHighlight(newRange, drawHighlightInfo); // 형관펜 화면에 그림
				appendHighlightListItem(highlightInfo); //형광펜 리스트 생성
			});

			onClose(); // 모달 닫기
		}
	};

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
					<Button variant="contained" onClick={(e) => handleCreateHighlight(e, null)}>
						하이라이트 생성
					</Button>
					<Button variant="contained" onClick={() => setInsertMemoOpen(true)}>
						메모 삽입
					</Button>
				</Box>

				{InsertMemoOpen && (
					<InsertMemo
						isOpen={InsertMemoOpen}
						onClose={() => setInsertMemoOpen(false)}
						userId={userId}
						handleCreateHighlight={handleCreateHighlight}
					/>
				)}
			</Box>
		</Modal>
	);
}

export default OptionsModal;
