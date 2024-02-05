export const moveToScroll = (container, scrollTop) => {
	container.current.scrollTop = scrollTop;
};

export const smoothScrollTo = (container, destination, duration) => {
	const start = container.scrollTop;
	const change = destination - start;
	const startTime = performance.now();

	const animateScroll = (currentTime) => {
		const elapsedTime = currentTime - startTime;
		const fraction = elapsedTime / duration;

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
