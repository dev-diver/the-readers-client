import React, { useEffect, useRef } from "react";
import Box from "@mui/joy/Box";
import { useRecoilState } from "recoil";
import { Pointer, Highlighter, PencilLine, MousePointerClick, Eraser } from "lucide-react";
import { penModeState } from "recoil/atom";
// import * as React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
// import PageCanvasGroup from "./PageCanvasGroup";
// import { ConnectingAirportsOutlined } from "@mui/icons-material";

export default function PenController() {
	const [mode, setMode] = useRecoilState(penModeState);

	// 펜 컨트롤러의 길이를 계산해 브라우저 가운데 넣기 위하여 추가한 코드
	const ref = useRef(null); // 요소에 대한 참조를 생성

	// const handleChange = (event, newMode) => {
	// 	setMode(newMode);
	// };

	useEffect(() => {
		console.log(mode);
	}, [mode]);

	return (
		<Box
			ref={ref}
			sx={{ backgroundColor: "#f7f7f7", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}
		>
			<ToggleButtonGroup
				orientation="horizontal"
				value={mode}
				exclusive
				onChange={(event, value) => {
					setMode(value);
				}}
				aria-label="Mode"
			>
				<ToggleButton value="pointer" aria-label="pointer">
					<Pointer />
				</ToggleButton>
				<ToggleButton value="highlight" aria-label="highlight">
					<Highlighter />
				</ToggleButton>
				<ToggleButton value="draw" aria-label="draw">
					<PencilLine />
				</ToggleButton>
				<ToggleButton value="click" aria-label="click">
					<Eraser />
				</ToggleButton>
			</ToggleButtonGroup>
		</Box>
	);
}
