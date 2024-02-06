import React from "react";
import { useRecoilState } from "recoil";
import { scrollerRefState, viewerScaleState } from "recoil/atom";
import { scrollToHighlight } from "../../PdfScroller/util";

const DISPLAY_LENGTH = 100;

export default function HighlightListItem({ hlInfo, deleteHandler }) {
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [scale, setScale] = useRecoilState(viewerScaleState);

	const displayText =
		hlInfo.text.length > DISPLAY_LENGTH ? hlInfo.text.substring(0, DISPLAY_LENGTH) + "..." : hlInfo.text;
	return (
		<div
			onClick={(e) => {
				scrollToHighlight(scrollerRef, hlInfo.id, scale);
			}}
		>
			<div data-page-num={hlInfo.pageNum} data-highlight-id={hlInfo.id}>
				{displayText}
			</div>
			<button onClick={deleteHandler}>삭제</button>
		</div>
	);
}
