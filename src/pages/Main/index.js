import React from "react";
import MakeRoom from "pages/Main/MakeRoom";
import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
// import "./style.css";

function Main() {
	return (
		<Box
			sx={{
				my: 8,
				mx: 4,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<FindRoom />
			<MakeRoom />
		</Box>
	);
}

export default Main;
