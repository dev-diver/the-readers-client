import React from "react";
import { Button, ButtonGroup, Box, Modal } from "@mui/material";
import { useState } from "react";
import AddMemo from "components/OnclickOptions/AddMemo";
import InsertLink from "components/OptionsModal/InsertLink";
import D3Graph from "components/D3Graph";
import api from "api";
import { on } from "events";

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
}) {
	// AddMemo 컴포넌트의 랜더링 상태를 제어
	const [showAddMemo, setShowAddMemo] = useState(false);
	const [showInsertLink, setShowInsertLink] = useState(false);
	const [showD3Graph, setShowD3Graph] = useState(false); // D3Graph 가시성 제어 상태
	const [linkData, setLinkData] = useState({ nodes: [], links: [] }); // API로부터 받은 링크 데이터를 저장

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
		} catch (error) {
			console.error("링크 데이터를 가져오는 데 실패했습니다.", error);
		}
	};

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

	return (
		<div className="button-groups" style={style}>
			<ButtonGroup
				variant="contained"
				color="primary"
				sx={{
					".MuiButton-root": { color: "white", "&:hover": { backgroundColor: "darkblue" } },
				}}
				highlightId={highlightId}
			>
				<Button onClick={handleAddMemoClick}>메모 삽입</Button>
				<Button onClick={handleInsertLinkClick}>링크 삽입</Button>
				<Button onClick={handleShowD3Graph}>링크</Button> {/* 버튼 클릭 시 d3로 내/외부 링크 랜더링 */}
				<Button>삭제</Button> {/* 버튼 클릭 시 하이라이트 삭제 */}
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
							onNodeClick={(nodeId) => console.log(`Node ${nodeId} was clicked`)} // 노드 클릭 시 실행될 함수
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
