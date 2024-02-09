import React, { useEffect, useRef } from "react";
import { logger } from "logger";
import { styled } from "@mui/material/styles";

export default function FormFile({ setFile }) {
	const onUpload = (e) => {
		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop();

		// 확장자 제한
		if (!["pdf"].includes(fileExt)) {
			window.alert("pdf만 가능합니다");
			return;
		}
		logger.log(file);

		setFile(file);
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

	return (
		<VisuallyHiddenInput id="book-upload" accept="application/pdf" multiple type="file" onChange={(e) => onUpload(e)} />
	);
}
