import { useRecoilCallback } from "recoil";
import { canvasElementsFamily, canvasHistoryFamily } from "recoil/atom";
import { debounce } from "lodash";
import api from "api";

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

export const debounceDrawSave = debounce((elements, location, userId) => {
	//draw save 로직  /book/:bookId/page/:pageNum/user/:userId 주소로 요청
	const { bookId, pageNum } = location;

	const jsonString = JSON.stringify(elements);
	const elementsBlob = new Blob([jsonString], { type: "application/json" });
	const formData = new FormData();
	formData.append("file", elementsBlob, "drawing.json");
	api.post(`/drawings/book/${bookId}/page/${pageNum}/user/${userId}`, formData).catch((err) => {
		console.log(err);
	});
}, 1000);

export const useUndoRedo = () => {
	const undo = useRecoilCallback(
		({ snapshot, set }) =>
			async (bookId, pageNum, userId) => {
				const Key = { bookId: bookId, pageNum: pageNum, userId: userId };
				const currentElements = await snapshot.getPromise(canvasElementsFamily(Key));
				//const currentHistory = snapshot.getLoadable(canvasHistoryFamily(elementsKey)).getValue();
				if (currentElements.length > 0) {
					const newHistoryItem = currentElements[currentElements.length - 1];

					const newElements = await snapshot
						.getPromise(canvasElementsFamily(Key))
						.then((prevElements) => prevElements.filter((ele, index) => index !== currentElements.length - 1));
					set(canvasHistoryFamily(Key), (prevHistory) => [...prevHistory, newHistoryItem]);
					set(canvasElementsFamily(Key), newElements);

					debounceDrawSave(newElements, Key, userId);
				}
			},
		[debounceDrawSave]
	);

	const redo = useRecoilCallback(
		({ snapshot, set }) =>
			async (bookId, pageNum, userId) => {
				const Key = { bookId: bookId, pageNum: pageNum, userId: userId };
				// const currentElements = snapshot.getLoadable(canvasElementsFamily(Key)).getValue();
				const currentHistory = await snapshot.getPromise(canvasHistoryFamily(Key));
				if (currentHistory.length > 0) {
					const currentHistoryItem = currentHistory[currentHistory.length - 1];
					const newElements = await snapshot
						.getPromise(canvasElementsFamily(Key))
						.then((prevElements) => [...prevElements, currentHistoryItem]);

					set(canvasElementsFamily(Key), newElements);
					set(canvasHistoryFamily(Key), (prevHistory) =>
						prevHistory.filter((ele, index) => index !== currentHistory.length - 1)
					);
					debounceDrawSave(newElements, Key, userId);
				}
			},
		[debounceDrawSave]
	);

	return { undo, redo };
};
