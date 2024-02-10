import React, { useState } from "react";
import api from "api";
import { Box, Button, Typography, Modal } from "@mui/material";
import ViewMyMarker from "components/ViewMyMarker";
import "./style.css";
import OnclickOptions from "components/OnclickOptions";

function MyMarkerComponent({ isOpen, onClose, IsMemoOpen, pageNum, userId, highlightId, bookId, children }) {
	const [highlights, setHighlights] = useState([]);
	const [showViewMyMarker, setShowViewMyMarker] = useState(false); // ViewMyMarker 컴포넌트 표시 상태
	const [onClickOptions, setOnClickOptions] = useState(false);
	const [links, setLinks] = useState([]);
	const handleComponentClick = async () => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("북아이디", bookId);
			console.log("하이라이트아이디", highlightId);
			console.log("데이터 입니다", response);
			setHighlights(response.data.data); // 상태 업데이트
			// setShowViewMyMarker(true); // ViewMyMarker 컴포넌트를 표시하기 위해 상태 업데이트
			setOnClickOptions(true);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	const handleComponentEnter = async () => {
		try {
			const response = await api.get(`/highlights/${highlightId}`);
			console.log("메모", response.data.data.memo);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	const handleCreateHighlight = async (e, memo) => {
		e.preventDefault(); // 폼 제출의 기본 동작 방지
		try {
			const response = await api.put(`/highlights/user/${userId}/memo`, {
				memo,
			});
			console.log("메모 생성 성공:", response.data);
			onClose(); // 모달 닫기
		} catch (error) {
			console.error("Failed to create highlight", error);
		}
	};

	const viewInnerLink = async () => {
		console.log("안녕하세요");
	};

	return (
		<>
			<mark
				data-highlight-id={highlightId}
				data-page-num={pageNum}
				data-user-id={userId}
				onClick={() => handleComponentClick()}
				onMouseEnter={() => handleComponentEnter()}
			>
				{children}
				{IsMemoOpen && (
					<button className="memobutton" onClick={() => viewInnerLink()}>
						✅
					</button>
				)}
			</mark>
			{/* {showViewMyMarker && (
				<ViewMyMarker
					isOpen={showViewMyMarker}
					onClose={() => setShowViewMyMarker(false)} // ViewMyMarker 컴포넌트 닫기
					bookId={bookId}
					MyMarkers={highlights}
					fromHighlightId={highlightId}
				/>
			)} */}
			{onClickOptions && (
				<OnclickOptions
					isOpen={onClickOptions}
					onClose={() => setOnClickOptions(false)}
					highlightId={highlightId}
					handleCreateHighlight={handleCreateHighlight}
					bookId={bookId}
				/>
			)}
		</>
	);
}

export default MyMarkerComponent;
