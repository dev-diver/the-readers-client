import React, { useEffect, useRef } from "react";
import Box from "@mui/joy/Box";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { useRecoilState } from "recoil";
import { penModeState, widthState } from "recoil/atom";
import { Pointer, Highlighter, PencilLine, MousePointerClick } from "lucide-react";
// import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
// import PageCanvasGroup from "./PageCanvasGroup";
// import { ConnectingAirportsOutlined } from "@mui/icons-material";

export default function PenController() {
	const [mode, setMode] = useRecoilState(penModeState);

	// 펜 컨트롤러의 길이를 계산해 브라우저 가운데 넣기 위하여 추가한 코드
	const [width, setWidth] = useRecoilState(widthState); // 요소의 너비를 저장할 상태
	const ref = useRef(null); // 요소에 대한 참조를 생성

	useEffect(() => {
		// ref.current는 참조된 DOM 요소를 가리킵니다. 요소가 마운트된 후에 너비를 읽어옵니다.
		if (ref.current) {
			setWidth(ref.current.offsetWidth); // 요소의 offsetWidth를 통해 너비를 얻음
		}

		// 선택적으로, 브라우저 리사이즈 이벤트에 따라 너비를 업데이트할 수 있습니다.
		const handleResize = () => {
			if (ref.current) {
				setWidth(ref.current.offsetWidth);
			}
		};

		window.addEventListener("resize", handleResize);

		// 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		console.log(mode);
	}, [mode]);

	return (
		<Box
			ref={ref}
			sx={{ backgroundColor: "#f7f7f7", borderRadius: "8px", border: "1px solid #ddd", overflow: "hidden" }}
		>
			<RadioGroup
				orientation="horizontal"
				aria-label="Mode"
				name="mode"
				variant="outlined"
				value={mode}
				onChange={(event) => {
					setMode(event.target.value);
				}}
			>
				{["pointer", "highlight", "draw", "click"].map((item) => (
					<Box
						key={item}
						sx={(theme) => ({
							position: "relative",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: 48,
							height: 48,
							"&:not([data-first-child])": {
								borderLeft: "1px solid",
								borderColor: "divider",
							},
							[`&[data-first-child] .${radioClasses.action}`]: {
								borderTopLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
								borderBottomLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
							},
							[`&[data-last-child] .${radioClasses.action}`]: {
								borderTopRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
								borderBottomRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
							},
						})}
					>
						<Radio
							value={item}
							disableIcon
							overlay
							label={
								{
									pointer: <Pointer color="#000000" />,
									highlight: <Highlighter color="#000000" />,
									draw: <PencilLine color="#000000" />,
									click: <MousePointerClick color="#000000" />,
								}[item]
							}
							variant={mode === item ? "solid" : "plain"}
							slotProps={{
								input: { "aria-label": item },
								action: {
									sx: { borderRadius: 0, transition: "none" },
								},
								label: { sx: { lineHeight: 0 } },
							}}
						/>
					</Box>
				))}
			</RadioGroup>
		</Box>
	);
}
