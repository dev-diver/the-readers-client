import { React, useEffect } from "react";
import { logger } from "logger";

let highlightId = 1;

// 하이라이트 칠해주는 함수
function highlightRange(range) {
	let passNode = false;
	logger.log("ancestor", range.commonAncestorContainer.textContent);
	logger.log("start", range.startContainer.textContent, "end", range.endContainer.textContent);

	const filterFunction = function (node) {
		if (node.hasChildNodes()) {
			return NodeFilter.FILTER_SKIP;
		}

		if (node === range.startContainer) {
			passNode = true;
		}

		logger.log("filtering : ", node.textContent);
		const filterState = passNode ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

		if (node === range.endContainer) {
			passNode = false;
		}

		return filterState;
	};

	const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, filterFunction);

	let parentElement;

	let currentNode = walker.nextNode();
	while (currentNode) {
		const nextNode = walker.nextNode();
		parentElement = currentNode.parentNode;
		logger.log("walking", currentNode.textContent);

		const marker = document.createElement("mark");
		marker.classList.add("red"); // 'yellow' 클래스 추가
		parentElement.replaceChild(marker, currentNode);
		marker.appendChild(currentNode);
		currentNode = nextNode;
	}
	highlightId++;
}

/**************************/
// 형광펜 정보를 백엔드로 전송하는 함수
function sendHighlightToServer(highlightInfos) {
	fetch("/highlights", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(highlightInfos),
	});
}

const handleMouseUp = () => {
	logger.log("mouseup");
	const selectedRange = window.getSelection();

	if (selectedRange.rangeCount > 0 && !selectedRange.isCollapsed) {
		const highlightInfos = [];

		for (let i = 0; i < selectedRange.rangeCount; i++) {
			const range = selectedRange.getRangeAt(i);
			// range에 대한 처리...
			// wrapRange(range,"yellow")
			highlightRange(range);

			// 형광펜 정보 저장
			highlightInfos.push({
				text: selectedRange.toString(), // 형광펜 칠해진 글자
				// startContainer: range.startContainer,
				startOffset: range.startOffset,
				// endContainer: range.endContainer,
				endOffset: range.endOffset, // 끝 위치
			});
		}
		// 형광펜 정보를 백엔드로 전송
		sendHighlightToServer(highlightInfos);
	}
	selectedRange.removeAllRanges();
};

export default function Highlights() {
	// 형광펜 드래그 이벤트 리스너
	useEffect(() => {
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	return <></>;
}
