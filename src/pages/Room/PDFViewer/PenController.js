import React from "react";
import Box from "@mui/joy/Box";
import Radio, { radioClasses } from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import { useRecoilState } from "recoil";
import { penModeState } from "recoil/atom";
import { Pointer, Highlighter, PencilLine, MousePointerClick } from "lucide-react";

export default function PenController() {
	const [mode, setMode] = useRecoilState(penModeState);

	return (
		<RadioGroup
			orientation="horizontal"
			aria-label="Mode"
			name="mode"
			variant="outlined"
			value={mode}
			onChange={(event) => setMode(event.target.value)}
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
	);
}
