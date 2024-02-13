import React, { useState, forwardRef } from "react";
import api from "api";
import { Typography, Grid, Box, Fab, Tooltip, Modal, TextField, Slider, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const MakeRoom = () => {
	const [user, setUser] = useRecoilState(userState);
	const [open, setOpen] = useState(false);

	const openModal = () => {
		if (!user) {
			alert("로그인을 해주세요");
			return;
		}
		setOpen(true);
	};

	const closeModal = () => {
		setOpen(false);
	};

	return (
		<Box>
			<Tooltip title="방 만들기">
				<Fab sx={{ my: 2, mx: 1 }} size="small" color="primary" aria-label="add" onClick={openModal}>
					<AddIcon />
				</Fab>
			</Tooltip>
			<Modal open={open} onClose={closeModal} aria-labelledby="modal-add-books" aria-describedby="modal-add-books">
				<MakeRoomForm closeModal={closeModal} />
			</Modal>
		</Box>
	);
};

const MakeRoomForm = forwardRef(({ closeModal }, ref) => {
	const [user, setUser] = useRecoilState(userState);
	const [roomName, setRoomName] = useState("");
	const [maxParticipants, setMaxParticipants] = useState(1);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		if (!user) {
			alert("로그인을 해주세요");
			return;
		}
		event.preventDefault();

		try {
			const response = await api.post("/rooms", {
				roomName,
				maxParticipants,
				user: user,
			});
			alert(response.data.message);
			// 데이터를 다 입력해야만 팝업창이 닫힘
			if (response.data.message === "방 생성 성공") {
				closeModal();
				navigate(`/room/${response.data.data.id}`);
			} // 성공 시 모달 닫기
		} catch (error) {
			console.error("에러발생", error.response.data.message);
		}
	};

	const handleChange = (e, newValue) => {
		setMaxParticipants(newValue);
	};

	function valuetext(value) {
		return `${value}명`;
	}

	return (
		<Box component="form" noValidate onSubmit={handleSubmit} sx={style}>
			<Typography component="h1" variant="h5">
				방 만들기
			</Typography>
			<TextField
				id="room-name-form"
				fullWidth
				label="방 이름"
				variant="outlined"
				onChange={(e) => setRoomName(e.target.value)}
				value={roomName}
			/>
			<Slider
				aria-label="인원 수"
				defaultValue={2}
				value={maxParticipants}
				onChange={handleChange}
				getAriaValueText={valuetext}
				step={1}
				marks
				min={2}
				max={20}
				valueLabelDisplay="auto"
			/>
			<Grid container>
				<Grid item xs></Grid>
				<Grid item>
					<Button type="submit" variant="contained">
						만들기
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
});

MakeRoomForm.displayName = "MakeRoomForm";

export default MakeRoom;
