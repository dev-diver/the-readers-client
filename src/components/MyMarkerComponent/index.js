import React, { useState } from "react";
import api from "api";
import { Tooltip, Box, Button, Typography, Modal } from "@mui/material";
import ViewMyMarker from "components/MarkerViewer";
import "./style.css";
import OnclickOptions from "components/OnclickOptions";

function MyMarkerComponent({ isOpen, onClose, IsMemoOpen, pageNum, userId, highlightId, bookId, children }) {
	const [highlights, setHighlights] = useState([]);
	const [onClickOptions, setOnClickOptions] = useState(false);
	const [memoData, setMemoData] = useState("");
	const [isTooltipOpen, setIsTooltipOpen] = useState(false); // Tooltip을 제어하기 위한 상태

	const handleComponentClick = async () => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("북아이디", bookId);
			console.log("하이라이트아이디", highlightId);
			console.log("데이터 입니다", response);
			setHighlights(response.data.data); // 상태 업데이트
			setOnClickOptions(true);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	const handleComponentLeave = () => {
		setIsTooltipOpen(false); // 마우스가 떠나면 Tooltip을 숨김
	};

	const handleComponentEnter = async () => {
		try {
			const response = await api.get(`/highlights/${highlightId}`);
			setMemoData(response.data.data.memo); // 메모 데이터를 상태에 저장
			console.log(response.data.data.memo);
			setIsTooltipOpen(true); // Tooltip을 표시
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	const handleCreateHighlight = async (e, memo) => {
		e.preventDefault(); // 폼 제출의 기본 동작 방지
		try {
			const response = await api.put(`/highlights/user/${userId}/memo`, {
				highlightId,
				memo,
			});
			console.log("메모 생성 성공:", response.data);
			onClose(); // 모달 닫기
		} catch (error) {
			console.error("Failed to create highlight", error);
		}
	};

	const viewInnerLink = async () => {};

	return (
		<>
			<mark
				data-highlight-id={highlightId}
				data-page-num={pageNum}
				data-user-id={userId}
				onClick={() => handleComponentClick()}
			>
				{children}
				{IsMemoOpen && (
					<>
						<Tooltip
							title={memoData || "No memo available"} // Tooltip에 표시할 텍스트
							open={isTooltipOpen} // Tooltip 표시 여부
							disableFocusListener // 포커스 시 Tooltip이 표시되지 않도록 함
							disableHoverListener // 호버 시 Tooltip이 자동으로 표시되지 않도록 함
							disableTouchListener // 터치 시 Tooltip이 표시되지 않도록 함
						>
							<Button
								className="memobutton"
								onMouseEnter={handleComponentEnter} // 마우스 오버 시 메모 데이터 로드
								onMouseLeave={handleComponentLeave} // 마우스 아웃 시 Tooltip 숨김
							>
								🔴{/* 메모 확인 버튼 */}
							</Button>
						</Tooltip>
						<button className="memobutton" onClick={() => viewInnerLink()}>
							🟠{/* 내부 링크 확인 버튼 */}
						</button>
						<button className="memobutton" onClick={() => viewInnerLink()}>
							🟡{/* 외부 링크 확인 버튼 */}
						</button>
					</>
				)}
			</mark>
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
