export const getCanvasRef = (drawingCanvasRefs, pageNum, userId) => {
	// console.log("drawingCanvasRefs", drawingCanvasRefs, pageNum, userId);
	const thisPageRef = drawingCanvasRefs.find((pageRef) => pageRef.page === pageNum);
	if (!thisPageRef) {
		return null;
	}
	if (!thisPageRef.userRefs[userId]) {
		return null;
	}
	const myCanvasRef = thisPageRef.userRefs[userId].current;
	if (!myCanvasRef) {
		return null;
	}
	return myCanvasRef;
};

export const imageToCanvas = (canvasImage, canvas, callback) => {
	console.log("canvas", canvas);
	if (canvas) {
		const context = canvas.getContext("2d");
		const image = new Image();

		image.onload = function () {
			context.clearRect(0, 0, canvas.width, canvas.height); // 이전 내용을 지웁니다.
			context.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지를 캔버스에 맞게 조정하여 그립니다.
			callback && callback();
		};

		image.src = canvasImage;
	}
};
