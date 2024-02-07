import React, { useEffect, useRef } from "react";
import { logger } from "logger";

export default function FormFile({ setFile }) {
	const onUpload = (e) => {
		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop();

		// 확장자 제한
		if (!["pdf", "html"].includes(fileExt)) {
			window.alert("pdf, html만 가능합니다");
			return;
		}
		logger.log(file);

		setFile(file);
	};

	return <input accept="application/pdf, .html" multiple type="file" onChange={(e) => onUpload(e)} />;
}
