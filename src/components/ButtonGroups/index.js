import React, { useEffect } from "react";
import { Button, ButtonGroup, Box, Modal } from "@mui/material";
import { useState } from "react";
import AddMemo from "components/OnclickOptions/AddMemo";
import InsertLink from "components/OptionsModal/InsertLink";
import D3Graph from "components/D3Graph";
import api from "api";
import { useNavigate } from "react-router-dom";
import { on } from "events";
import { eraseHighlight } from "pages/RoomRouter/Room/PDFViewer/Highlighter/util";

function ButtonGroups({
	style,
	isOpen,
	onClose,
	userId,
	bookId,
	highlightId,
	selectedHighlightInfo,
	appendHighlightListItem,
	sendHighlightToServer,
	handleCreateHighlight,
	scrollerRef,
	roomId,
}) {
	// AddMemo 컴포넌트의 랜더링 상태를 제어
	const [showAddMemo, setShowAddMemo] = useState(false);
	const [showInsertLink, setShowInsertLink] = useState(false);
	const [showD3Graph, setShowD3Graph] = useState(false); // D3Graph 가시성 제어 상태
	const [linkData, setLinkData] = useState({ nodes: [], links: [] }); // API로부터 받은 링크 데이터를 저장

	const navigate = useNavigate();
	const [pendingNodeId, setPendingNodeId] = useState(null); // 페이지 이동을 위해 대기 중인 nodeId를 저장
	useEffect(() => {
		if (!showD3Graph && pendingNodeId !== null) {
			navigate(`/room/1/book/1?highlightId=${pendingNodeId}`);
			setPendingNodeId(null); // 필요에 따라 상태 초기화
		}
	}, [showD3Graph, pendingNodeId, navigate]);

	// 메모 삽입 버튼 클릭 이벤트 핸들러
	const handleAddMemoClick = () => {
		console.log("메모 삽입 버튼 클릭");
		setShowAddMemo(true); // AddMemo 컴포넌트를 렌더링하도록 상태 업데이트
	};

	// AddMemo 컴포넌트의 닫기 버튼 클릭 이벤트 핸들러
	const handleCloseAddMemo = () => {
		setShowAddMemo(false); // AddMemo 컴포넌트를 렌더링하지 않도록 상태 업데이트
	};

	const handleInsertLinkClick = () => {
		console.log("링크 삽입 버튼 클릭");
		setShowInsertLink(true);
	};

	const handleCloseInsertLink = () => {
		setShowInsertLink(false);
	};

	const closeModal = () => {
		setShowAddMemo(false);
		onClose();
	};

	// D3Graph 모달을 여는 새 핸들러
	const handleShowD3Graph = async () => {
		try {
			// API에서 링크 데이터를 가져옴
			const response = await api.get(`link/${highlightId}`);
			if (response.data && response.data.data) {
				// 가져온 데이터를 D3Graph에 맞게 변환하고 설정
				setLinkData(transformData(response.data.data)); // transformData 함수가 있다고 가정
			}
			setShowD3Graph(true); // D3Graph 모달 표시
			await updateGraphDataWithOuterlinks(); // 외부 링크 데이터를 가져와서 그래프에 반영
		} catch (error) {
			console.error("링크 데이터를 가져오는 데 실패했습니다.", error);
		}
	};

	// Outerlink 데이터 가져오기
	const fetchOuterlinksData = async () => {
		try {
			// API를 호출하여 외부 링크 데이터를 가져옵니다.
			const response = await api.get(`/outerlinks/${highlightId}`);
			// API 응답에서 데이터 부분을 반환합니다.
			return response.data.data;
		} catch (error) {
			console.error("외부 링크를 가져오는 데 실패했습니다.", error);
			// 에러 발생 시 빈 배열 또는 적절한 기본값을 반환할 수 있습니다.
			return [];
		}
	};

	async function updateGraphDataWithOuterlinks() {
		try {
			const outerlinksData = await fetchOuterlinksData();
			// 가정: fetchOuterlinksData()는 외부 링크 데이터를 배열로 반환합니다.
			const newNodes = outerlinksData.map((outerlink) => ({
				id: outerlink.id.toString(), // ID를 문자열로 변환
				label: "Outerlink Node", // 노드 레이블 지정
				note: outerlink.note || "No note", // 노드에 메모 정보 추가
				isOuterLink: true, // 외부 링크 플래그 추가
				url: outerlink.url, // 외부 링크 URL 추가
			}));

			setLinkData((prevData) => {
				const updatedNodes = [...prevData.nodes, ...newNodes];
				// 외부 링크를 나타내는 새 링크 객체 추가
				const updatedLinks = [
					...prevData.links,
					...newNodes.map((node) => ({
						source: highlightId.toString(), // 현재 하이라이트를 소스로 설정
						target: node.id, // 새로운 외부 링크 노드를 타겟으로 설정
						note: "외부 링크", // 선 위의 텍스트를 "외부 링크"로 설정
					})),
				];

				return { nodes: updatedNodes, links: updatedLinks };
			});

			setShowD3Graph(true); // D3Graph 모달을 열어 변경사항 반영
		} catch (error) {
			console.error("Outerlinks 데이터를 가져오는 데 실패했습니다.", error);
		}
	}

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

	const handleNodeClick = async (nodeId) => {
		// D3Graph 컴포넌트를 닫는 로직 (예: 상태 변경)
		setShowD3Graph(false);
		// 페이지 이동 로직
		navigate(`/room/${roomId}/book/${bookId}?highlightId=${nodeId}`);
	};

	// 하이라이트 삭제를 처리하는 함수
	const handleDeleteHighlight = async () => {
		console.log("하이라이트 삭제 버튼 클릭", highlightId);
		try {
			// DELETE 요청을 보내는 api.delete가 설정되어 있다고 가정
			const response = await api.delete(`/highlights/${highlightId}`);
			if (response.status === 200 || response.status === 204) {
				alert("하이라이트가 성공적으로 삭제되었습니다.");
				eraseHighlight(scrollerRef, highlightId); // 화면에서 하이라이트 지우기
				onClose(); // ButtonGroups 컴포넌트 닫기
			} else {
				alert("하이라이트 삭제에 실패했습니다.");
			}
		} catch (error) {
			console.error("하이라이트 삭제 중 에러 발생:", error);
			alert("하이라이트를 삭제하는 동안 오류가 발생했습니다.");
		}
	};

	return (
		<div className="button-groups" style={style}>
			<ButtonGroup
				variant="contained"
				color="primary"
				sx={{
					".MuiButton-root": { color: "white", "&:hover": { backgroundColor: "darkblue" } },
				}}
			>
				<Button onClick={handleAddMemoClick}>메모 삽입</Button>
				<Button onClick={handleInsertLinkClick}>링크 삽입</Button>
				<Button onClick={handleShowD3Graph}>링크</Button> {/* 버튼 클릭 시 d3로 내/외부 링크 랜더링 */}
				<Button onClick={handleDeleteHighlight}>삭제</Button> {/* 버튼 클릭 시 하이라이트 삭제 */}
			</ButtonGroup>
			{showAddMemo && (
				<AddMemo
					isOpen={showAddMemo}
					onClose={handleCloseAddMemo}
					onCloseEntire={onClose} // 부모 컴포넌트에서 제공하는 onClose 함수를 호출하여 ButtonGroups 컴포넌트를 닫습니다.
					userId={userId}
					highlightId={highlightId}
					sendHighlightToServer={sendHighlightToServer}
					selectedHighlightInfo={selectedHighlightInfo}
					appendHighlightListItem={appendHighlightListItem}
					handleCreateHighlight={handleCreateHighlight}
				/>
			)}{" "}
			{showInsertLink && (
				<InsertLink
					isOpen={showInsertLink}
					onClose={handleCloseInsertLink} // InsertLink 컴포넌트를 닫는 로직
					onCloseEntire={onClose}
					userId={userId}
					bookId={bookId}
					highlightId={highlightId}
				/>
			)}
			{showD3Graph && (
				<Modal open={showD3Graph} onClose={() => setShowD3Graph(false)}>
					<Box sx={modalStyle} onClose={closeModal}>
						<D3Graph
							highlightId={highlightId}
							data={linkData} // 그래프를 그리는 데 필요한 데이터 객체
							width={900} // 그래프의 너비를 지정
							height={400} // 그래프의 높이를 지정
							// onNodeClick={(nodeId) => console.log(`Node ${nodeId} was clicked`)} // 노드 클릭 시 실행될 함수
							onNodeClick={handleNodeClick} // 노드 클릭 시 실행될 함수
						/>
						<Button
							onClick={closeModal}
							variant="contained"
							color="primary"
							style={{ position: "absolute", top: 10, right: 10 }}
						>
							닫기
						</Button>
					</Box>
				</Modal>
			)}
		</div>
	);
}

export default ButtonGroups;
