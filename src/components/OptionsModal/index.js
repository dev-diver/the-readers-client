import React from "react";
import { Modal, Button } from "@mui/material";
import "./style.css";

const OptionsModal = ({ open, onClose, highlightInfo }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div className="modal-container">
				<h4 className="modal-title">수행할 작업을 선택하세요</h4>
				<Button className="modal-button" onClick={() => console.log("메모 작성 로직")}>
					메모 작성
				</Button>
				<Button className="modal-button" onClick={() => console.log("링크 삽입 로직")}>
					링크 삽입
				</Button>
				<Button className="modal-button" onClick={() => console.log("아웃터링크 삽입 로직")}>
					아웃터링크 삽입
				</Button>
			</div>
		</Modal>
	);
};

export default OptionsModal;
