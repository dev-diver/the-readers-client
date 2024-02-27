import { createRoot } from "react-dom/client";
import React from "react";
import MyMarkerComponent from "components/MyMarkerComponent";
import api from "api";
import socket from "socket.js";
import { coloringUser } from "components/Chart/utils";
import { highlightListState } from "recoil/atom";
import { useRecoilCallback } from "recoil";

function getElemPageNum(elem) {
	const pageNumHex = getElemPageContainer(elem).getAttribute("data-page-no");
	const pageNumInt = parseInt(pageNumHex, 16);
	return pageNumInt;
}

/* Get Containers */
function getElemPageContainer(elem) {
	// console.log(container);
	if (elem.nodeType === Node.TEXT_NODE) {
		elem = elem.parentElement; //TEXT_NODE는 attribute가 없으므로
	}
	while (elem && !elem.hasAttribute("data-page-no")) {
		elem = elem.parentElement;
	}
	if (elem) {
		return elem;
	}
	return null;
}

export function numToPageContainer(pageNumInt) {
	const pageNumHex = parseInt(pageNumInt).toString(16);
	console.log("find page Hex", pageNumInt, pageNumHex);
	return document.querySelector(`[data-page-no="${pageNumHex}"]`);
}

/*  node <-> pathNum  convert */

function nodeToPathNum(container) {
	const pageDiv = getElemPageContainer(container);

	if (!pageDiv) {
		console.log("nodeToPathNum pageDiv is null");
	}

	let index = 0;
	let markerCount = 0;
	let splitCount = 0;
	const filterFunction = function (node) {
		const isMarkTag = node.classList?.contains("marker");
		if (isMarkTag) {
			markerCount++;
			const split = parseInt(node.getAttribute("data-split"));
			splitCount += split;
		}
		const filterState = isMarkTag ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
		return filterState;
	};

	const iterator = document.createTreeWalker(pageDiv, NodeFilter.SHOW_ALL, filterFunction);
	let elem = iterator.nextNode();
	while (elem !== container) {
		index++;
		elem = iterator.nextNode();
	}
	return index + markerCount - splitCount;
}

function pathNumToNode(pageNum, pathNum) {
	const pageDiv = numToPageContainer(pageNum);

	if (!pageDiv) {
		console.log("pathNumToNode: pageDiv is null", pageNum, pathNum);
	}

	let index = 0;
	let markerCount = 0;
	let splitCount = 0;
	const filterFunction = function (node) {
		const isMarkTag = node.classList?.contains("marker");
		if (isMarkTag) {
			markerCount++;
			const split = parseInt(node.getAttribute("data-split"));
			splitCount += split;
		}
		const filterState = isMarkTag ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
		return filterState;
	};

	const iterator = document.createTreeWalker(pageDiv, NodeFilter.SHOW_ALL, filterFunction);
	let elem = iterator.nextNode();
	while (elem && index + markerCount - splitCount !== pathNum) {
		index++;
		elem = iterator.nextNode();
	}
	return elem ? elem : null;
}

function getLastMarker(elem) {
	let sibling = elem.previousSibling;
	while (sibling) {
		if (sibling.nodeType === 1 && sibling.classList?.contains("marker")) {
			return sibling;
		}
		sibling = sibling.previousSibling;
	}

	return null;
}

function getLastMarkerEndOffset(elem) {
	const lastMarker = getLastMarker(elem);
	if (lastMarker) {
		return parseInt(lastMarker.getAttribute("data-endOffset"));
	}
	return 0;
}

/* Info <-> Range convert */

export function InfoToRange(Info) {
	let range = document.createRange();
	let startContainer = pathNumToNode(Info.pageNum, Info.startContainer);

	let startContainerEndOffset = startContainer.textContent.length;

	while (startContainerEndOffset < Info.endOffset) {
		startContainer = startContainer.nextSibling;
		if (startContainer?.classList?.contains("marker")) {
			startContainerEndOffset += parseInt(startContainer.getAttribute("data-text-length"));
		} else {
			startContainerEndOffset += startContainer.textContent.length;
		}
	}

	let endContainer = pathNumToNode(Info.pageNum, Info.endContainer);

	let endContainerEndOffset = endContainer.textContent.length;
	while (endContainerEndOffset < Info.endOffset) {
		endContainer = endContainer.nextSibling;
		if (endContainer.classList?.contains("marker")) {
			endContainerEndOffset += parseInt(endContainer.getAttribute("data-text-length"));
		} else {
			endContainerEndOffset += endContainer.textContent.length;
		}
	}

	const startOffset = Info.startOffset - getLastMarkerEndOffset(startContainer);
	const endOffset = Info.endOffset - getLastMarkerEndOffset(endContainer);
	console.log(Info.startOffset, getLastMarkerEndOffset(startContainer), startOffset);
	range.setStart(startContainer, startOffset);
	range.setEnd(endContainer, endOffset);

	return range;
}

export function rangeToInfo(range, additionalInfo) {
	const pageNum = getElemPageNum(range.startContainer);
	const startContainerIdx = nodeToPathNum(range.startContainer);
	const endContainerIdx = nodeToPathNum(range.endContainer);
	const lastMarkerEndOffset = getLastMarkerEndOffset(range.startContainer);

	const highlightInfo = {
		bookId: additionalInfo.bookId,
		id: additionalInfo.id,
		pageNum: pageNum,
		text: additionalInfo.text, // 형광펜 칠해진 글자
		startContainer: startContainerIdx, //range.startContainer,
		startOffset: lastMarkerEndOffset + range.startOffset,
		endContainer: endContainerIdx, //range.endContainer,
		endOffset: lastMarkerEndOffset + range.endOffset, // 끝 위치
	};
	return highlightInfo;
}

export const loadAndDrawPageHighlight = (userId, bookId, pageNum, mine, scrollerProps, recoilProps) => {
	api.get(`/highlights/user/${userId}/book/${bookId}/page/${pageNum}`).then((response) => {
		console.log("highlight", response.data);
		response.data.forEach((highlightInfo) => {
			console.log("highlightInfo", highlightInfo);
			const newRange = InfoToRange(highlightInfo);
			const drawHighlightInfo = {
				id: highlightInfo.id,
				userId: userId,
				color: coloringUser(highlightInfo.Users[0].id),
				bookId: bookId,
			};
			drawHighlight(newRange, drawHighlightInfo, scrollerProps, recoilProps);
		});
	});
};

/* Draw ,Erase */

export function drawHighlight(range, highlightInfo, scrollerProps, recoilProps) {
	// console.log(setButtonGroupsPos, "setButtonGroupPos");
	// console.log(scrollerRef, "scrollerRef");
	// console.log(setCurrentHighlightId, "scrollerRef");
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
		createMarkTag(part, highlightInfo, range, true, 2, scrollerProps, recoilProps);
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
	//처음
	const part = currentNode.splitText(range.startOffset);
	createMarkTag(part, highlightInfo, range, false, 1, scrollerProps, recoilProps);

	currentNode = walker.nextNode();
	while (currentNode) {
		const nextNode = walker.nextNode();
		const isEnd = !nextNode;
		if (isEnd) {
			currentNode.splitText(range.endOffset);
		}
		createMarkTag(currentNode, highlightInfo, range, isEnd, isEnd ? 1 : 0, scrollerProps, recoilProps);
		currentNode = nextNode;
	}
	// let currentNode = walker.nextNode();
	// while (currentNode) {
	// 	console.log(currentNode, currentNode.nodeType);
	// 	currentNode = walker.nextNode();
	// }
}

const createMarkTag = (currentNode, highlightInfo, range, isEnd = false, split = 0, scrollerProps, recoilProps) => {
	const marker = document.createElement("mark");
	marker.style.backgroundColor = highlightInfo.color;
	marker.classList.add("marker");
	marker.setAttribute("data-endOffset", range.endOffset);
	marker.setAttribute("data-split", split);
	marker.setAttribute("data-text-length", currentNode.textContent.length);
	marker.setAttribute("data-highlight-id", highlightInfo.id);
	marker.setAttribute("data-page-num", getElemPageNum(range.startContainer));
	marker.setAttribute("data-user-id", highlightInfo.userId);

	const IsMemoOpen = isEnd;
	// marker 요소에 대한 새로운 root를 생성하고, MyMarkerComponent를 렌더링합니다.
	const markerRoot = createRoot(marker); // marker 요소에 대한 root 생성
	// console.log(setButtonGroupsPos, scrollerRef, "createMarkTag setButtonGroupPos");
	// console.log(setCurrentHighlightId, "createMarkTag setCurrentHighlightId");
	markerRoot.render(
		<MyMarkerComponent
			highlightInfo={highlightInfo}
			IsMemoOpen={IsMemoOpen}
			scrollerProps={scrollerProps}
			recoilProps={recoilProps}
		>
			{currentNode.textContent}
		</MyMarkerComponent>
	);
	currentNode.parentElement.replaceChild(marker, currentNode);

	return marker;
};

export const useDeleteHighlightListItem = () => {
	return useRecoilCallback(({ snapshot, set }) => async (scrollerRef, highlightInfo, roomId) => {
		console.log("deleteHighlightListItem", highlightInfo);
		const highlightList = await snapshot.getPromise(highlightListState);
		set(
			highlightListState,
			highlightList.filter((h) => h.id !== highlightInfo.id)
		);

		api
			.delete(`/highlights/${highlightInfo.id}`)
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});

		eraseHighlight(scrollerRef, highlightInfo.id);
		socket.emit("delete-highlight", { roomId: roomId, ...highlightInfo });
	});
};

export function eraseHighlight(scrollerRef, highlightId) {
	const highlightMarks = scrollerRef.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
	console.log("erase highlight", highlightMarks);
	highlightMarks.forEach((mark) => {
		console.log("erase", mark);
		eraseOneMark(mark);
		console.log("erase complete");
	});
}

function eraseOneMark(mark) {
	const parent = mark.parentNode;
	const contentNode = getContentNode(mark);

	if (contentNode.nodeType === Node.TEXT_NODE) {
		const textContent = contentNode.textContent;

		let combinedText = "";
		let prevTextNode = mark.previousSibling;
		let nextTextNode = mark.nextSibling;

		if (prevTextNode && prevTextNode.nodeType === Node.TEXT_NODE) {
			combinedText += prevTextNode.textContent;
			parent.removeChild(prevTextNode);
		}

		combinedText += textContent;

		if (nextTextNode && nextTextNode.nodeType === Node.TEXT_NODE) {
			combinedText += nextTextNode.textContent;
			parent.removeChild(nextTextNode);
		}

		const newTextNode = document.createTextNode(combinedText);
		parent.insertBefore(newTextNode, mark);
		parent.removeChild(mark);
	} else {
		console.log("Not a Text Node", contentNode.NodeType);
		parent.insertBefore(contentNode, mark);
		parent.removeChild(mark);
	}
}

function getContentNode(mark) {
	const spanNode = mark.childNodes[0];
	const contentNode = spanNode.childNodes[0];
	console.log("spanNode", spanNode, "contentNode", contentNode);
	return spanNode.childNodes[0];
}
