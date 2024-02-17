import React, { useEffect, useState, useRef } from "react";
import api from "api";
import { Box, Button, TextField, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function MarkerViewer({ isOpen, onClose, bookId, userId, fromHighlightId, MyMarkers, onCloseEntire }) {
	const [selectionModel, setSelectionModel] = useState([]);

	// const [notes, setNotes] = useState({});
	// Refs를 저장하기 위한 객체 생성
	const noteRefs = useRef({});

	const handleSubmit = async () => {
		// 선택된 행들의 ID를 사용하여 API 호출
		const selectedIDs = selectionModel; // 선택된 행들의 ID 배열
		// const userId =
		// 	// API 호출 로직을 여기에 작성
		// 	console.log("선택된 행의 ID:", selectedIDs);
		const toHighlightId = selectedIDs;

		// 선택된 ID에 대한 note 값을 저장하는 객체
		const notesToSubmit = {};
		selectedIDs.forEach((id) => {
			// noteRefs에서 해당 id의 TextField 값을 읽어옴
			const noteValue = noteRefs.current[id]?.value || "";
			notesToSubmit[id] = noteValue;
		});

		if (selectedIDs.length === 1) {
			const singleNote = notesToSubmit[selectedIDs[0]]; // 선택된 단일 ID에 대한 note 값

			try {
				// 단일 링크 생성 API 호출 // 선택된 ID에 해당하는 note 값
				const response = await api.post(`/link`, {
					userId: userId,
					fromHighlightId: fromHighlightId,
					toHighlightId: selectedIDs[0],
					note: singleNote, // 실제로 입력된 note 값을 사용
				});
				console.log("링크 생성 성공:", response.data);
			} catch (error) {
				console.error("링크 생성 실패:", error);
			}
		} else if (selectedIDs.length > 1) {
			try {
				// 다중 링크 생성 API 호출
				// 예를 들어, '/links' 경로로 POST 요청을 보낼 때, body에 배열 형태로 데이터 전달
				const linksData = selectedIDs.map((toHighlightId) => ({
					fromHighlightId,
					toHighlightId,
					note: notesToSubmit[toHighlightId], // 각 ID에 해당하는 note 값을 사용
				}));
				const response = await api.post(`/link/many`, { userId: userId, links: linksData });
				console.log("다중 링크 생성 성공:", response.data);
				console.log("userId", userId, "linksData", linksData);
			} catch (error) {
				console.error("다중 링크 생성 실패:", error);
			}
		}
		onCloseEntire(); // 전체 모달 닫기
	};

	const handleKeyDown = (event) => {
		// 스페이스바가 눌렸을 때 이벤트 전파 방지
		if (event.key === " ") {
			event.stopPropagation();
		}
	};

	const columns = [
		{ field: "pageNum", headerName: "페이지", width: 70 },
		{ field: "text", headerName: "텍스트", width: 450 }, // 너비 조정
		{ field: "memo", headerName: "메모", width: 150 },
		{
			field: "note",
			headerName: "요약",
			width: 150,
			renderCell: (params) => (
				<TextField
					variant="outlined"
					size="small"
					defaultValue={params.value || ""}
					// 각 TextField에 ref 할당
					inputRef={(el) => (noteRefs.current[params.id] = el)}
					onKeyDown={handleKeyDown} // 이벤트 핸들러 추가
				/>
			),
		},
	];

	const rows = MyMarkers.map((marker) => ({
		id: marker.id,
		pageNum: marker.pageNum,
		text: marker.text,
		memo: marker.memo || "",
		// note: marker.note || "",
		note: marker.note || "",
	}));

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
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle}>
				<div style={{ height: 400, width: "100%" }}>
					<DataGrid
						rows={rows}
						disableRowSelectionOnClick
						checkboxSelection // 체크박스 선택 활성화
						columns={columns}
						pageSize={25} // Set the initial page size.
						rowsPerPageOptions={[25, 50, 100]} // Allow users to change the page size to these options.
						initialState={{
							pagination: {
								paginationModel: { pageSize: 25, page: 0 },
							},
							sorting: {
								sortModel: [{ field: "pageNum", sort: "asc" }],
							},
						}}
						onRowSelectionModelChange={(newSelectionModel) => {
							setSelectionModel(newSelectionModel);
						}}
						selectionModel={selectionModel}
					/>
				</div>
				<Box mt={2} display="flex" justifyContent="flex-end">
					<Button onClick={onClose} sx={{ mr: 2 }}>
						닫기
					</Button>
					<Button variant="contained" color="primary" onClick={handleSubmit}>
						제출
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default MarkerViewer;
