import React from "react";

import FindRoom from "components/FindRoom";
import { Box } from "@mui/material";
// import "./style.css";

function Main() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<FindRoom />
		</Box>
	);
}

export default Main;
