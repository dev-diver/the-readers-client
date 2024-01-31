function elemPageContainer(container) {
	console.log(container);
	if (container.nodeType === Node.TEXT_NODE) {
		container = container.parentElement;
	}
	while (container && !container.hasAttribute("data-page-no")) {
		container = container.parentElement;
	}
	if (container) {
		return container;
	}
	return null;
}

function elemPageNum(container) {
	console.log("elemPageNum", container);

	return elemPageContainer(container).getAttribute("data-page-no");
}

function numToPageContainer(pageNum) {
	console.log("numToPageContainer", pageNum);
	return document.querySelector(`[data-page-no="${pageNum}"]`);
}

function nodeToPathNum(container) {
	const pageDiv = elemPageContainer(container);
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

	console.log("pathNumToNode", elem);
	return elem ? elem : null;
}

export function InfoToRange(Info) {
	let range = document.createRange();
	range.setStart(pathNumToNode(Info.pageNum, Info.startContainer), Info.startOffset);
	range.setEnd(pathNumToNode(Info.pageNum, Info.endContainer), Info.endOffset);

	return range;
}

export function rangeToInfo(range, additionalInfo) {
	console.log("range", range);
	console.log("startContainer", range.startContainer);

	const pageNum = elemPageNum(range.startContainer);
	const startContainerIdx = nodeToPathNum(range.startContainer);
	const endContainerIdx = nodeToPathNum(range.endContainer);

	const highlightInfo = {
		num: additionalInfo.num,
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
