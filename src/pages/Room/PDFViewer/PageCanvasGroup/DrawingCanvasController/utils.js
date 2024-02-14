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
	if (canvas) {
		console.log(canvas, canvasImage);
		const context = canvas.getContext("2d");
		const image = new Image();

		image.onload = function () {
			context.clearRect(0, 0, canvas.width, canvas.height); // 이전 내용을 지웁니다.
			context.drawImage(image, 0, 0, canvas.width, canvas.height); // 이미지를 캔버스에 맞게 조정하여 그립니다.
			callback && callback();
		};

		image.src = canvasImage;
	} else {
		// console.error("canvas is null");
	}
};

export const blobToJson = (blob) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function () {
			try {
				const json = JSON.parse(reader.result);
				resolve(json);
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = function (error) {
			reject(error);
		};
		reader.readAsText(blob);
	});
};

export const arrayBufferToJson = (arrayBuffer) => {
	return new Promise((resolve, reject) => {
		// ArrayBuffer를 문자열로 변환
		const decoder = new TextDecoder("utf-8");
		const text = decoder.decode(arrayBuffer);
		try {
			// 문자열을 JSON으로 파싱
			const json = JSON.parse(text);
			resolve(json);
		} catch (error) {
			reject(error);
		}
	});
};
