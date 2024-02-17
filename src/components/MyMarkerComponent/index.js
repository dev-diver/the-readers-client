import React, { useState, useEffect } from "react";
import api from "api";
import { Tooltip, Box, Button, Typography, Modal } from "@mui/material";
import "./style.css";
import D3Graph from "components/D3Graph";
import Outerlinks from "components/Outerlinks";
import { getRelativeTopLeft } from "pages/Room/PDFViewer/PdfScroller/util";
// import { useRecoilState } from "recoil";
// import { currentHighlightIdState } from "recoil/atom";

function MyMarkerComponent({ onClose, IsMemoOpen, highlightInfo, setButtonGroupsPos, scrollerRef, children }) {
	const [highlights, setHighlights] = useState([]);
	const [onClickOptions, setOnClickOptions] = useState(false);
	const [memoData, setMemoData] = useState("");
	const [isTooltipOpen, setIsTooltipOpen] = useState(false); // Tooltip을 제어하기 위한 상태
	const { id: highlightId, userId, bookId } = highlightInfo;
	const [D3GraphOpen, setD3GraphOpen] = useState(false);
	const [linkData, setLinkData] = useState({ nodes: [], links: [] }); // API로부터 받은 링크 데이터를 저장
	const [outerlinks, setOuterlinks] = useState([]);
	// MyMarkerComponent에서 outerlinks 상태를 boolean으로 관리하기 위한 새로운 상태 추가
	const [isOuterlinksOpen, setIsOuterlinksOpen] = useState(false);
	const [activePage, setActivePage] = useState(null); // 현재 활성화된 페이지 번호
	// const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);

	// const popButtonGroup = (e) => {
	// 	// console.log("popButtonGroup", setButtonGroupsPos);

	// 	const rect = e.target.getBoundingClientRect();
	// 	const x = rect.left + rect.width / 2;
	// 	const y = rect.top - 30; // 하이라이트 위에 렌더링하기 위해 조정
	// 	console.log("handle highlight Click", x, y);
	// 	setButtonGroupsPos({ visible: true, x, y });
	// };

	const popButtonGroup = (e) => {
		console.log("popButtonGroup", scrollerRef);
		if (!scrollerRef) return; // scrollerRef가 유효한지 확인
		const { top, left } = getRelativeTopLeft(e.target, scrollerRef); // 상대 좌표를 계산
		console.log(e.target);
		console.log("top", top, "left", left);

		setButtonGroupsPos({ visible: true, x: left, y: top }); // 계산된 위치를 사용하여 상태 업데이트
	};

	useEffect(() => {
		if (D3GraphOpen) {
			// D3Graph 모달이 열릴 때 링크 데이터를 가져옴
			const fetchLinkData = async () => {
				try {
					const response = await api.get(`link/${highlightId}`);
					if (response.data && response.data.data) {
						setLinkData(transformData(response.data.data)); // 가져온 데이터를 상태에 저장
					}
				} catch (error) {
					console.error("Failed to fetch link data", error);
				}
			};

			fetchLinkData();
		}
	}, [D3GraphOpen, highlightId]);

	const transformData = (links) => {
		const nodes = [{ id: highlightId.toString(), label: "Highlight Node" }]; // ID를 문자열로 변환
		links.forEach((link) => {
			// toHighlightId를 노드 배열에 추가
			const targetId = link.toHighlightId.toString(); // ID를 문자열로 변환
			if (!nodes.some((node) => node.id === targetId)) {
				nodes.push({ id: targetId, label: "Connected Node", note: link.note || "No note" });
			}
		});

		const linksTransformed = links.map((link) => ({
			source: highlightId.toString(),
			target: link.toHighlightId.toString(),
			note: link.note.toString() || "No note",
		}));

		return { nodes, links: linksTransformed };
	};

	const handleComponentClick = async (e) => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("북아이디", bookId);
			console.log("하이라이트아이디", highlightId);
			console.log("유저아이디", userId);
			setHighlights(response.data.data); // 상태 업데이트
			// setCurrentHighlightId(highlightId);
			// setOnClickOptions(true);
			popButtonGroup(e);
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

	// const viewLink = async () => {
	// 	setD3GraphOpen(true);
	// };
	const viewLink = async (e) => {
		e.stopPropagation(); // 이벤트 버블링 중지 -> handleComponentClick 작동 방지
		setD3GraphOpen(true);
	};

	const viewOuterlink = async (e) => {
		e.stopPropagation(); // 이벤트 버블링 중지 -> handleComponentClick 작동 방지
		setIsOuterlinksOpen(true); // Outerlinks 모달을 열기 위해 상태를 true로 설정

		console.log("외부 링크 확인 버튼 클릭");
		console.log("highlightId", highlightId);
	};

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 900, // 모달 너비 조정
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		outline: "none",
	};

	return (
		<>
			<span onClick={(e) => handleComponentClick(e)}>
				{children}
				{IsMemoOpen && (
					<>
						<Tooltip
							title={memoData || "메모가 없습니다."} // Tooltip에 표시할 텍스트
							open={isTooltipOpen} // Tooltip 표시 여부
							disableFocusListener // 포커스 시 Tooltip이 표시되지 않도록 함
							disableHoverListener // 호버 시 Tooltip이 자동으로 표시되지 않도록 함
							disableTouchListener // 터치 시 Tooltip이 표시되지 않도록 함
							className="button-over-mark"
						>
							<Button
								variant="contained"
								size="large"
								className="memobutton"
								onMouseEnter={handleComponentEnter} // 마우스 오버 시 메모 데이터 로드
								onMouseLeave={handleComponentLeave} // 마우스 아웃 시 Tooltip 숨김
								style={{
									fontSize: "1.5rem",
									padding: "12px 24px",
									borderRadius: "8px",
								}}
							>
								🔴{/* 메모 확인 버튼 */}
							</Button>
						</Tooltip>
						<Button
							variant="contained"
							size="large"
							href="#contained-buttons"
							// onClick={() => viewLink()}
							onClick={(e) => viewLink(e)} // 이벤트 객체를 viewLink 함수에 전달
							className="button-over-mark"
							style={{
								fontSize: "1.5rem",
								padding: "12px 24px",
								borderRadius: "8px",
							}}
						>
							🟠{/* 내부 링크 확인 버튼 */}
						</Button>
						<Button
							className="memobutton"
							variant="contained"
							size="large"
							href="#contained-buttons"
							style={{
								fontSize: "1.5rem",
								padding: "12px 24px",
								borderRadius: "8px",
							}}
							onClick={(e) => viewOuterlink(e)}
						>
							🟡{/* 외부 링크 확인 버튼 : 아직 구현 못함. */}
						</Button>
					</>
				)}
			</span>
			{/* {onClickOptions && (
				<OnclickOptions
					isOpen={onClickOptions}
					onClose={() => setOnClickOptions(false)}
					highlightId={highlightId}
					handleCreateHighlight={handleCreateHighlight}
					bookId={bookId}
				/>
			)} */}
			{D3GraphOpen && (
				<Modal open={D3GraphOpen} onClose={() => setD3GraphOpen(false)}>
					<Box sx={modalStyle}>
						<D3Graph
							highlightId={highlightId}
							data={linkData} // 그래프를 그리는 데 필요한 데이터 객체
							width={900} // 그래프의 너비를 지정
							height={400} // 그래프의 높이를 지정
							onNodeClick={(nodeId) => console.log(`Node ${nodeId} was clicked`)} // 노드 클릭 시 실행될 함수
						/>
					</Box>
				</Modal>
			)}
			{isOuterlinksOpen && (
				<Outerlinks isOpen={isOuterlinksOpen} onClose={() => setIsOuterlinksOpen(false)} highlightId={highlightId} />
			)}
		</>
	);
}

export default MyMarkerComponent;
