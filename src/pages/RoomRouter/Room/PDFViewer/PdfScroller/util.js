import { numToPageContainer } from "../Highlighter/util";
import { useRecoilCallback } from "recoil";
import { pageLoadingStateFamily, pageScrollTopFamily } from "recoil/atom";

/* deprecated */
export const moveToScroll = (container, scrollTop) => {
	container.scrollTop = scrollTop;
};

export const smoothScrollTo = (container, destinationY, duration = 300) => {
	const start = container.scrollTop;
	const change = destinationY - start;
	const startTime = performance.now();

	const animateScroll = (currentTime) => {
		const elapsedTime = currentTime - startTime;
		let fraction = elapsedTime / duration;

		fraction = Math.min(fraction, 1);

		container.scrollTop = start + change * fraction;

		if (fraction < 1) {
			requestAnimationFrame(animateScroll);
		}
	};
	requestAnimationFrame(animateScroll);
};

export const scrollToHighlight = (scroller, highlightId, scale) => {
	const highlight = scroller.querySelector(`[data-highlight-id="${highlightId}"]`);
	console.log("find highlight", highlightId, highlight, scroller, scale);
	if (highlight) {
		let top = getRelativeTop(highlight, scroller) * scale;
		smoothScrollTo(scroller, top, 300);
	}
};

export const scrollToPage = (scroller, pageNum, scale) => {
	const pageDiv = numToPageContainer(pageNum);
	console.log("find container", pageDiv);
	if (pageDiv) {
		let top = getRelativeTop(pageDiv, scroller) * scale;
		smoothScrollTo(scroller, top, 300);
	}
};

export const getRelativeTop = (element, container) => {
	let top = 0;
	let currentElement = element;
	while (currentElement && container.contains(currentElement) && currentElement !== container) {
		top += currentElement.offsetTop;
		currentElement = currentElement.offsetParent;
	}

	return top;
};

export const getRelativeTopLeft = (element, container) => {
	let top = 0;
	let left = 0;
	let currentElement = element;
	while (currentElement && container.contains(currentElement) && currentElement !== container) {
		top += currentElement.offsetTop;
		left += currentElement.offsetLeft;
		currentElement = currentElement.offsetParent;
	}
	return { top, left };
};

export const useDetermineCurrentPage = () => {
	const determineCurrentPage = useRecoilCallback(
		({ snapshot }) =>
			async (bookId, totalPage, currentScrollY) => {
				let currentPageKey = null;
				for (let page = 1; page <= totalPage; page++) {
					const Key = { bookId: bookId, pageNum: page };
					const scrollTop = await snapshot.getPromise(pageScrollTopFamily(Key));
					// console.log("page", page, "scrollTop", scrollTop);
					if (currentScrollY >= scrollTop) {
						currentPageKey = page;
					} else {
						break;
					}
				}
				return currentPageKey;
			},
		[]
	);

	return determineCurrentPage;
};

export const useGetPageScrollTop = () => {
	const getPageScrollTop = useRecoilCallback(
		({ snapshot }) =>
			async (bookId, pageNum) => {
				const Key = { bookId: bookId, pageNum: pageNum };
				const scrollTop = await snapshot.getPromise(pageScrollTopFamily(Key));
				return scrollTop;
			},
		[]
	);

	return getPageScrollTop;
};

export const useGetPageLoadState = () => {
	const getPageLoadState = useRecoilCallback(
		({ snapshot }) =>
			async (bookId, pageNum, userId) => {
				const Key = { bookId: bookId, pageNum: pageNum, userId: userId };
				const loadState = await snapshot.getPromise(pageLoadingStateFamily(Key));
				return loadState;
			},
		[]
	);

	return getPageLoadState;
};
