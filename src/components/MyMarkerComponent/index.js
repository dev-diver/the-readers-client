import React, { useState } from "react";
import api from "api";
import { Box, Button, Typography, Modal } from "@mui/material";
import ViewMyMarker from "components/ViewMyMarker";
import "./style.css";

function MyMarkerComponent({ isOpen, onClose, IsMemoOpen, pageNum, userId, highlightId, bookId, children }) {
	const [highlights, setHighlights] = useState([]);
	const [showViewMyMarker, setShowViewMyMarker] = useState(false); // ViewMyMarker 컴포넌트 표시 상태

	// 클릭 이벤트 핸들러
	const handleComponentClick = async () => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("북아이디", bookId);
			console.log("하이라이트아이디", highlightId);
			console.log("데이터 입니다", response);
			setHighlights(response.data.data); // 상태 업데이트
			setShowViewMyMarker(true); // ViewMyMarker 컴포넌트를 표시하기 위해 상태 업데이트
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
				{IsMemoOpen && <button className="memobutton">✅</button>}
			</mark>
			{showViewMyMarker && (
				<ViewMyMarker
					isOpen={showViewMyMarker}
					onClose={() => setShowViewMyMarker(false)} // ViewMyMarker 컴포넌트 닫기
					bookId={bookId}
					MyMarkers={highlights}
					fromHighlightId={highlightId}
				/>
			)}
		</>
	);
}

export default MyMarkerComponent;
