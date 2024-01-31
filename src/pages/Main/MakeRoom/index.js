import React, { useState } from "react";
import api from "api";
import "./style.css";
function MakeRoom() {
	const [isOpen, setIsOpen] = useState(false);
	const [maxParticipants, setMaxParticipants] = useState(1);
	const [roomName, setRoomName] = useState("");

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await api.post("/rooms", {
				roomName,
				maxParticipants,
			});
			alert(response.data.message);
			// 데이터를 다 입력해야만 팝업창이 닫힘
			if (response.data.message === "방 생성 성공") closeModal(); // 성공 시 모달 닫기
		} catch (error) {
			console.error("에러발생", error.message);
		}
	};

	const increaseParticipants = () => {
		setMaxParticipants((prevCount) => prevCount + 1);
	};

	const decreaseParticipants = () => {
		setMaxParticipants((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
	};

	// 상태 업데이트 핸들러
	const handleRoomNameChange = (e) => {
		setRoomName(e.target.value);
	};

	return (
		<div>
			<button onClick={openModal}>방 만들기</button>
			{isOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<form onSubmit={handleSubmit}>
							<label>방 이름</label>
							<br />
							<input type="text" placeholder="방제를 입력하세요." value={roomName} onChange={handleRoomNameChange} />
							<br />
							<label>최대 인원</label>
							<br />
							<input type="text" value={maxParticipants} readOnly />
							<button type="button" onClick={increaseParticipants}>
								+
							</button>
							<button type="button" onClick={decreaseParticipants}>
								-
							</button>
							<br />
							<button type="submit">만들기</button>
							<button type="button" onClick={closeModal}>
								취소
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default MakeRoom;
