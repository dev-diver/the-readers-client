import React, { useState, useEffect } from "react";
import api from "api";
import { Tooltip } from "@mui/material";
import "./style.css";
import { throttle } from "lodash";

function MyMarkerComponent({ highlightInfo, scrollerProps, recoilProps, children }) {
	const [highlights, setHighlights] = useState([]);
	const [memoData, setMemoData] = useState("");
	// const [memoRequested, setMemoRequested] = useState(false);
	const [isTooltipOpen, setIsTooltipOpen] = useState(false); // Tooltip을 제어하기 위한 상태
	const { id: highlightId, userId, bookId } = highlightInfo;
	const [D3GraphOpen, setD3GraphOpen] = useState(false);
	const [linkData, setLinkData] = useState({ nodes: [], links: [] }); // API로부터 받은 링크 데이터를 저장
	const [tooltipTimeout, setTooltipTimeout] = useState(null);

	const popButtonGroup = (e) => {
		if (!scrollerProps.ref) return; // scrollerRef가 유효한지 확인
		const rect = e.target.getBoundingClientRect(); // 클릭한 요소의 크기와 위치 정보를 가져옴
		recoilProps.setButtonGroupsPos({ visible: true, x: rect.left, y: rect.top - 23 }); // 계산된 위치를 사용하여 상태 업데이트
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

	const handleComponentClick = throttle(async (e) => {
		try {
			const response = await api.get(`/highlights/book/${bookId}`);
			console.log("recoilProps", recoilProps);
			recoilProps.setSelectedHighlightInfo(highlightInfo);
			setHighlights(response.data.data); // 상태 업데이트
			popButtonGroup(e);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	}, 300);

	const handleComponentLeave = () => {
		setIsTooltipOpen(false); // 마우스가 떠나면 Tooltip을 숨김
		if (tooltipTimeout) clearTimeout(tooltipTimeout); // 마우스가 떠나면 타이머 초기화
	};

	useEffect(() => {
		return () => {
			if (tooltipTimeout) clearTimeout(tooltipTimeout); // 컴포넌트 언마운트 시 타이머 초기화
		};
	}, [tooltipTimeout]);

	const handleComponentEnter = async () => {
		try {
			const response = await api.get(`/highlights/${highlightId}`);
			setMemoData(response.data.data.memo);
			setIsTooltipOpen(true); // Tooltip을 표시

			// 타이머 설정
			const timeout = setTimeout(() => {
				setIsTooltipOpen(false);
			}, 4000); // 4초 후 툴팁 숨김
			setTooltipTimeout(timeout);
		} catch (error) {
			console.error("Failed to fetch highlights", error);
		}
	};

	return (
		<>
			<span
				onMouseEnter={handleComponentEnter}
				onMouseLeave={handleComponentLeave}
				onClick={(e) => handleComponentClick(e)}
			>
				{children}
				{memoData && isTooltipOpen && (
					<>
						<Tooltip
							title={memoData} // Tooltip에 표시할 텍스트
							open={isTooltipOpen} // Tooltip 표시 여부
							disableFocusListener // 포커스 시 Tooltip이 표시되지 않도록 함
							disableHoverListener // 호버 시 Tooltip이 자동으로 표시되지 않도록 함
							disableTouchListener // 터치 시 Tooltip이 표시되지 않도록 함
							className="button-over-mark"
							componentsProps={{
								tooltip: {
									sx: {
										// color: "purple",	// 글자색 우선은 안바꿈
										// backgroundColor: "lightblue",	// 배경색 우선은 안바꿈
										fontSize: "2em",
									},
								},
							}}
						></Tooltip>
					</>
				)}
			</span>
		</>
	);
}

export default MyMarkerComponent;
