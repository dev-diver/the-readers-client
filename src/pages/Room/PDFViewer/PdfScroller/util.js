import { numToPageContainer } from "../Highlights/util";
import { useRecoilCallback } from "recoil";

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

export const calculateScrollY = (pageContainer) => {
	const scrollY = pageContainer.scrollTop;
	const containerHeight = pageContainer.scrollHeight;
	const clientHeight = pageContainer.clientHeight;
	const totalScrollableHeight = containerHeight - clientHeight;
	// (스크롤 위치 / 전체 스크롤 가능한 길이) * 10 = (전체 길이상대적인 스크롤 위치)
	return Math.round((scrollY / totalScrollableHeight) * 30);
};

export const scrollToHighlight = (scroller, highlightId, scale) => {
	const highlight = scroller.querySelector(`[data-highlight-id="${highlightId}"]`);
	console.log("find highlight", highlight, scroller, scale);
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

export const useDetermineCurrentPage = () => {
	const determineCurrentPage = useRecoilCallback(
		({ snapshot }) =>
			async (totalPage, currentScrollY) => {
				let currentPageKey = null;
				for (let page = 1; page <= totalPage; page++) {
					const Key = { bookId: bookId, pageNum: page, userId: userId };
					const scrollTop = await snapshot.getPromise(pageScrollPositionFamily(Key));
					if (currentScrollY >= scrollTop) {
						currentPageKey = page;
					} else {
						break;
					}
				}
				console.log(`Current Page: ${currentPageKey}`);
				return currentPageKey;
			},
		[]
	);

	return determineCurrentPage;
};
