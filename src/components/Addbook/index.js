import React from "react";
import UploadBookToRoom from "components/UploadBookToRoom";
import FindBook from "components/FindBook";
import PopUp from "components/PopUp";
import { useState } from "react";
import api from "api";
import { Button, Grid, Box } from "@mui/material";

const AddBook = ({ room, refresher, className }) => {
	const [pop, setPop] = useState(false);

	const bookClickHandler = (book) => {
		api
			.post(`/rooms/${room.id}/books/${book.id}`, {})
			.then((response) => {
				console.log(response.data);
				if (response.status === 200) {
					refresher((prev) => !prev);
					setPop(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const togglePop = () => {
		setPop(!pop);
	};

	return (
		<div className={className || ""}>
			<Grid container direction="column" spacing={2} cursor="auto">
				<Grid item>
					<Button variant="contained" onClick={togglePop}>
						{pop ? "닫기" : "책 추가"}
					</Button>
				</Grid>
				<Grid
					item
					sx={{
						transform: pop ? "translateY(0)" : "translateY(100%)", // 활성화 시 원래 위치로, 비활성화 시 아래로
						opacity: pop ? 1 : 0,
						transition: "transform 0.5s ease-out, opacity 0.5s ease-out", // 부드러운 애니메이션 효과
						width: "100%",
						position: "fixed", // 화면에 고정
						bottom: "111%",
						left: 0,
						backgroundColor: "#f9f9f9", // 연한 흰색 배경색 설정
						padding: 2, // 패딩 추가
						borderRadius: 1, // 테두리 둥글게 처리
						boxShadow: 1, // 그림자 효과 추가
						zIndex: 2, // 다른 요소들 위에 표시되도록 zIndex 설정
					}}
				>
					{pop && (
						<PopUp isOpen={pop} onClose={() => setPop(false)}>
							<FindBook bookClickHandler={bookClickHandler} />
							<Box mt={2} mb={2}></Box>
							<UploadBookToRoom roomId={room?.id} setPop={setPop} refresher={refresher} />
						</PopUp>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default AddBook;
