import React, { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import InsertHighlight from "./InsertHighlight";
import { InfoToRange, drawHighlight } from "pages/RoomRouter/Room/PDFViewer/Highlighter/util";
import api from "api";
import { logger } from "logger";
import socket from "socket.js";

import InsertMemo from "./InsertMemo";
import { useRecoilState } from "recoil";
import { buttonGroupsPosState, scrollerRefState, currentHighlightIdState } from "recoil/atom";

// 세 가지의 옵션 제공 : 하이라이트 생성, 메모 삽입, 링크 삽입
function OptionsModal({
	isOpen,
	onClose,
	user,
	bookId,
	roomId,
	setHighlightId,
	selectedHighlightInfo,
	appendHighlightListItem,
	color, // 하이라이트 색상 기본값 설정
}) {
	const [InsertMemoOpen, setInsertMemoOpen] = useState(false);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);

	const recoilProps = {
		setButtonGroupsPos,
		setCurrentHighlightId,
	};

	const sendHighlightToServer = async (highlightInfo) => {
		console.log("user", user, "하이라이트 정보", highlightInfo);
		if (!user) {
			return null; // 세미콜론은 여기서 선택적이지만, 명확성을 위해 사용할 수 있습니다.
		}

		const MAX_TEXT_LENGTH = 255; // 서버에서 허용하는 최대 길이
		if (highlightInfo.text && highlightInfo.text.length > MAX_TEXT_LENGTH) {
			highlightInfo.text = highlightInfo.text.substring(0, MAX_TEXT_LENGTH);
		}

		return api
			.post(`/highlights/user/${user.id}`, highlightInfo)
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

	const handleCreateHighlight = async (event, memo) => {
		event.preventDefault();

		// 혹시 몰라서 달아줌.
		if (!selectedHighlightInfo || selectedHighlightInfo.length === 0) {
			alert("선택된 하이라이트가 없습니다. 하이라이트를 먼저 생성해주세요.");
			return; // 함수 early return
		}

		for (const highlightInfo of selectedHighlightInfo) {
			console.log("하이라이트 정보", highlightInfo);
			const newRange = InfoToRange(highlightInfo);
			const modifiedHighlightInfo = {
				...highlightInfo,
				memo: memo,
			};
			const highlightId = await sendHighlightToServer(modifiedHighlightInfo); // 형광펜 서버로 전송

			// 하이라이트 ID가 유효하지 않은 경우 처리
			if (!highlightId) {
				alert("하이라이트 생성에 실패했습니다. 하이라이트를 다시 칠하세요.");
				continue; // 다음 하이라이트 처리로 넘어감
			}

			console.log("하이라이트 아이디입니다.", highlightId);
			const drawHighlightInfo = {
				id: highlightId,
				userId: user.id,
				color: color,
				bookId: bookId,
			};

			// 소켓에 전송 및 화면에 그리기
			socket.emit("insert-highlight", { ...modifiedHighlightInfo, id: highlightId }); // 소켓에 전송
			drawHighlight(newRange, drawHighlightInfo, scrollerRef, recoilProps); // 화면에 그림
			appendHighlightListItem({ ...modifiedHighlightInfo, id: highlightId }); // 리스트에 추가
		}

		onClose(); // 모달 닫기
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
						userId={user.id}
						handleCreateHighlight={handleCreateHighlight}
					/>
				)}
			</Box>
		</Modal>
	);
}

export default OptionsModal;
