import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";
import AddMemo from "components/OnclickOptions/AddMemo";

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
				// highlightId={highlightId}
			>
				<Button onClick={handleAddMemoClick}>메모 삽입</Button>
				<Button>링크 삽입</Button>
				<Button>링크</Button> {/* 버튼 클릭 시 d3로 내/외부 링크 랜더링 */}
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
			{/* showAddMemo 상태가 true일 때만 AddMemo 컴포넌트 렌더링 */}
		</div>
	);
}

export default ButtonGroups;
