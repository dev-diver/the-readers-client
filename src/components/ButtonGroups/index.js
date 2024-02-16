import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import AddMemo from "components/OnclickOptions/AddMemo";
// import { useRecoilState } from "recoil";
// import { currentHighlightIdState } from "recoil/atom";

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
	// const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);

	// 메모 삽입 버튼 클릭 이벤트 핸들러
	const handleAddMemoClick = () => {
		setShowAddMemo(true); // AddMemo 컴포넌트를 렌더링하도록 상태 업데이트
	};

	// AddMemo 컴포넌트의 닫기 버튼 클릭 이벤트 핸들러
	const handleCloseAddMemo = () => {
		setShowAddMemo(false); // AddMemo 컴포넌트를 렌더링하지 않도록 상태 업데이트
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
				<Button>링크 삽입</Button>
				<Button>내부 링크</Button>
				<Button>외부 링크</Button>
			</ButtonGroup>
			{showAddMemo && (
				<AddMemo
					isOpen={showAddMemo}
					onClose={handleCloseAddMemo}
					onCloseEntire={onClose}
					userId={userId}
					highlightId={highlightId}
					sendHighlightToServer={sendHighlightToServer}
					selectedHighlightInfo={selectedHighlightInfo}
					appendHighlightListItem={appendHighlightListItem}
					handleCreateHighlight={handleCreateHighlight}
				/>
			)}{" "}
			{/* showAddMemo 상태가 true일 때만 AddMemo 컴포넌트 렌더링 */}
		</div>
	);
}

export default ButtonGroups;
