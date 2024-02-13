import { createRoot } from "react-dom/client";
import React from "react";
import MyMarkerComponent from "components/MyMarkerComponent";

function getElemPageNum(elem) {
	// console.log("elemPageNum", container);
	return getElemPageContainer(elem).getAttribute("data-page-no");
}

/* Get Containers */
function getElemPageContainer(elem) {
	// console.log(container);
	if (elem.nodeType === Node.TEXT_NODE) {
		elem = elem.parentElement;
	}
	while (elem && !elem.hasAttribute("data-page-no")) {
		elem = elem.parentElement;
	}
	if (elem) {
		return elem;
	}
	return null;
}

export function numToPageContainer(pageNum) {
	// console.log("numToPageContainer", pageNum);
	return document.querySelector(`[data-page-no="${pageNum}"]`);
}

/*  node <-> pathNum  convert */

function nodeToPathNum(container) {
	const pageDiv = getElemPageContainer(container);
	let index = 0;

	if (!pageDiv) {
		console.log("nodeToPathNum pageDiv is null");
	}

	const filterFunction = function (node) {
		const isNotMarkTag = node.nodeName !== "MARK";
		const filterState = isNotMarkTag ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		return filterState;
	};

	const iterator = document.createNodeIterator(pageDiv, NodeFilter.SHOW_ALL, filterFunction);
	while (iterator.nextNode() !== container) {
		index++;
	}

	return index;
}

function pathNumToNode(pageNum, pathNum) {
	const pageDiv = numToPageContainer(pageNum);

	if (!pageDiv) {
		console.log("pathNumToNode: pageDiv is null", pageNum, pathNum);
	}

	let index = 0;
	const filterFunction = function (node) {
		const isNotMarkTag = node.nodeName !== "MARK";
		const filterState = isNotMarkTag ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		return filterState;
	};

	const iterator = document.createNodeIterator(pageDiv, NodeFilter.SHOW_ALL, filterFunction);
	let elem = iterator.nextNode();
	while (elem && index !== pathNum) {
		index++;
		elem = iterator.nextNode();
	}
	// console.log("pathNumToNode", elem);
	return elem ? elem : null;
}

/* Info <-> Range convert */

export function InfoToRange(Info) {
	let range = document.createRange();
	// console.log(Info);
	range.setStart(pathNumToNode(Info.pageNum, Info.startContainer), Info.startOffset);
	range.setEnd(pathNumToNode(Info.pageNum, Info.endContainer), Info.endOffset);

	return range;
}

export function rangeToInfo(range, additionalInfo) {
	const pageNum = getElemPageNum(range.startContainer);
	const startContainerIdx = nodeToPathNum(range.startContainer);
	const endContainerIdx = nodeToPathNum(range.endContainer);

	const highlightInfo = {
		bookId: additionalInfo.bookId,
		id: additionalInfo.id,
		pageNum: pageNum,
		text: additionalInfo.text, // 형광펜 칠해진 글자
		startContainer: startContainerIdx, //range.startContainer,
		startOffset: range.startOffset,
		endContainer: endContainerIdx, //range.endContainer,
		endOffset: range.endOffset, // 끝 위치
	};
	return highlightInfo;
}

/* Draw ,Erase */

export function drawHighlight(range, highlightInfo) {
	// console.log("drawHighlight", range, highlightInfo);

	//같은 경우 처리
	if (range.startContainer === range.endContainer) {
		const startOffset = range.startOffset;
		const endOffset = range.endOffset;
		const part = range.startContainer.splitText(startOffset);
		// console.log("(before) start, end", range.startOffset, range.endOffset);
		// console.log("(after) start, end", range.startOffset, range.endOffset);
		// console.log("(before) end-start", range.endOffset - range.startOffset);
		// console.log("(after) end-start", range.endOffset);
		// console.log("const", endOffset - startOffset);
		part.splitText(endOffset - startOffset);
		createMarkTag(part, highlightInfo, range, true);
		return;
	}

	let passNode = false;
	const filterFunction = function (node) {
		if (node.nodeType !== Node.TEXT_NODE) {
			return NodeFilter.FILTER_SKIP;
		}

		if (node === range.startContainer) {
			passNode = true;
			return NodeFilter.FILTER_ACCEPT;
		}

		if (node === range.endContainer) {
			passNode = false;
			return NodeFilter.FILTER_ACCEPT;
		}

		const filterState = passNode ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

		return filterState;
	};

	const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, filterFunction);
	let currentNode = walker.nextNode();
	console.log(range.startContainer, currentNode);
	//처음
	const part = currentNode.splitText(range.startOffset);
	createMarkTag(part, highlightInfo, range);

	currentNode = walker.nextNode();
	while (currentNode) {
		console.log(range.startContainer, currentNode);
		const nextNode = walker.nextNode();
		const isEnd = !nextNode;
		if (isEnd) {
			currentNode.splitText(range.endOffset);
		}
		createMarkTag(currentNode, highlightInfo, range, isEnd);
		currentNode = nextNode;
	}
}

const createMarkTag = (currentNode, highlightInfo, range, isEnd = false) => {
	const marker = document.createElement("mark");
	marker.classList.add(highlightInfo.color);
	const IsMemoOpen = isEnd;
	// marker 요소에 대한 새로운 root를 생성하고, MyMarkerComponent를 렌더링합니다.
	const markerRoot = createRoot(marker); // marker 요소에 대한 root 생성
	markerRoot.render(
		<MyMarkerComponent
			isOpen={false}
			onClose={() => {}}
			highlightId={highlightInfo.id}
			pageNum={getElemPageNum(range.startContainer)}
			bookId={highlightInfo.bookId}
			userId={highlightInfo.userId}
			color={highlightInfo.color}
			text={currentNode.textContent}
			IsMemoOpen={IsMemoOpen}
		>
			{currentNode.textContent}
		</MyMarkerComponent>
	);
	currentNode.parentElement.replaceChild(marker, currentNode);
	return marker;
};

export function eraseHighlight(highlightId) {
	const highlightMarks = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
	//highlightMarks를 감싸고 있는 mark를 제거
	highlightMarks.forEach((mark) => {
		const parent = mark.parentNode;
		while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
		parent.removeChild(mark);
	});
}
