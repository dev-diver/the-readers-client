import React, { useEffect, useState } from "react";
import api from "api";
import { Modal, Box, Button, Typography, Link } from "@mui/material";
import { on } from "events";

function Outerlinks({ isOpen, onClose, highlightId }) {
	const [outerlinks, setOuterlinks] = useState([]);

	useEffect(() => {
		const fetchOuterlinks = async () => {
			try {
				const response = await api.get(`/outerlinks/${highlightId}`);
				setOuterlinks(response.data.data);
			} catch (error) {
				console.error("외부 링크를 가져오는 데 실패했습니다.", error);
			}
		};

		if (isOpen) {
			fetchOuterlinks();
		}
	}, [isOpen, highlightId]);

	const modalStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		boxShadow: 24,
		p: 4,
		outline: "none", // 모달 포커스 시 아웃라인 제거
	};

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			aria-labelledby="outerlinks-modal-title"
			aria-describedby="outerlinks-modal-description"
		>
			<Box sx={modalStyle}>
				<Typography id="outerlinks-modal-title" variant="h6" component="h2">
					외부 링크
				</Typography>
				<Box sx={{ mt: 2 }}>
					{outerlinks.map((link, index) => (
						<Box key={index} sx={{ mb: 2 }}>
							{/* 이동 버튼 없이 URL을 클릭하여 이동하도록 수정 */}
							<Link href={link.url} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-block", mt: 1 }}>
								{link.url}
							</Link>
							<Typography variant="body1">메모: {link.note}</Typography>
						</Box>
					))}
				</Box>
				<Button
					variant="contained"
					onClick={() => {
						onClose();
					}}
					sx={{ mt: 2 }}
				>
					닫기
				</Button>
			</Box>
		</Modal>
	);
}

export default Outerlinks;
