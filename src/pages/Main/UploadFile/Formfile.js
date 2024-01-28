import React, { useEffect, useRef } from "react";

export default function FormFile({ setFile }) {
	const inputRef = useRef([]);

	const onUpload = (e) => {
		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop();

		// 확장자 제한
		if (!["pdf", "html"].includes(fileExt)) {
			window.alert("pdf, html만 가능합니다");
			return;
		}
		console.log(file);

		setFile(file);
	};

	return (
		<input
			accept="application/pdf, .html"
			multiple
			type="file"
			ref={(el) => (inputRef.current[0] = el)}
			onChange={(e) => onUpload(e)}
		/>
	);
}
