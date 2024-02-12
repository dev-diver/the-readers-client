import socket from "socket";

// export const canvasMouse = (event, roomUser, location, info) => {
export const canvasMouse = (event, info) => {
	event.stopPropagation();
	const canvas = event.target;
	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;

	let offsetX = (event.clientX - rect.left) * scaleX;
	let offsetY = (event.clientY - rect.top) * scaleY;

	let element = event.target;
	while (element && event.currentTarget.contains(element) && element !== event.currentTarget) {
		offsetX += element.offsetLeft;
		offsetY += element.offsetTop;
		element = element.offsetParent;
	}

	// console.log(`pagenum ${pageNum} x: ${offsetX}, y: ${offsetY}`);
	socket.emit("move-pointer", {
		userId: info.user.id, // 로그인해야 userId.id가 존재.
		// user: roomUser,
		// roomId: location.roomId,
		// bookId: location.bookId,
		bookId: info.bookId,
		pageNum: info.pageNum,
		// page: location.pageNum,
		x: offsetX,
		y: offsetY,
	});
};

export const updatePointers = (pointers, data) => {
	// 새로운 포인터 데이터 추가 또는 업데이트
	const index = pointers.findIndex((p) => p.id === data.id);
	if (index >= 0) {
		pointers[index] = data;
	} else {
		pointers.push(data);
	}
};

export const redrawCanvas = (canvas, pointers) => {
	if (!canvas.current) return;
	clearCanvas(canvas);
	pointers.forEach((p) => {
		drawOnCanvas(canvas, p.x, p.y, p.color);
	});
};

export const clearCanvas = (canvas) => {
	if (!canvas.current) return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export function drawOnCanvas(canvas, x, y, color) {
	// console.log("draw", x, y, color);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = color; // 서버로부터 받은 색상 사용
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2, false);
	ctx.fill(); // 텍스트 그리기
}
