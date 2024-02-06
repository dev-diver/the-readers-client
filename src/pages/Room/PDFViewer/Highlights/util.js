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
		console.log("pathNumToNode: pageDiv is null");
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
	console.log(Info);
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
	let passNode = false;

	const filterFunction = function (node) {
		if (node.hasChildNodes() || node.nodeType !== Node.TEXT_NODE) {
			return NodeFilter.FILTER_SKIP;
		}

		if (node === range.startContainer) {
			passNode = true;
			return NodeFilter.FILTER_SKIP;
		}

		if (node === range.endContainer) {
			passNode = false;
			return NodeFilter.FILTER_SKIP;
		}

		const filterState = passNode ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

		return filterState;
	};

	const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, filterFunction);

	let parentElement;
	//range.startContainer 의 range.startOffset 부터 range.startContainer 의 끝까지를 mark로 감싸는 코드

	//중간
	let currentNode = walker.nextNode();
	console.log(currentNode);
	while (currentNode) {
		const nextNode = walker.nextNode();
		parentElement = currentNode.parentNode;

		const marker = document.createElement("mark");
		marker.classList.add(highlightInfo.color);
		marker.setAttribute("data-highlight-id", highlightInfo.id);
		marker.setAttribute("data-page-num", getElemPageNum(range.startContainer));
		marker.setAttribute("data-user-id", highlightInfo.userId);
		parentElement.replaceChild(marker, currentNode);
		marker.appendChild(currentNode);
		currentNode = nextNode;
	}
}

export function eraseHighlight(highlightId) {
	const highlightMarks = document.querySelectorAll(`[data-highlight-id="${highlightId}"]`);
	//highlightMarks를 감싸고 있는 mark를 제거
	highlightMarks.forEach((mark) => {
		const parent = mark.parentNode;
		while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
		parent.removeChild(mark);
	});
}
