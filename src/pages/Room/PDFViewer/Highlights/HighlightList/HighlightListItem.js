import React from "react";

const DISPLAY_LENGTH = 100;

export default function HighlightListItem({ hlInfo, deleteHandler }) {
	const displayText =
		hlInfo.text.length > DISPLAY_LENGTH ? hlInfo.text.substring(0, DISPLAY_LENGTH) + "..." : hlInfo.text;
	return (
		<div>
			<div data-page-num={hlInfo.pageNum} data-highlight-id={hlInfo.id}>
				{displayText}
			</div>
			<button onClick={deleteHandler}>삭제</button>
		</div>
	);
}
