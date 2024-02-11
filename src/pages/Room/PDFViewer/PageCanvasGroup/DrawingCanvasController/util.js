import socket from "socket";

const tool = "pencil";
const color = "black";

export const getCanvasRef = (drawingCanvasRefs, pageNum, userId) => {
	// console.log("drawingCanvasRefs", drawingCanvasRefs, pageNum, userId);
	const thisPageRef = drawingCanvasRefs.find((pageRef) => pageRef.page === pageNum);
	// console.log("thisPageRef", thisPageRef, pageNum, userId);
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
	// console.log("myCanvasRef", myCanvasRef, pageNum, userId);
	return myCanvasRef;
};
