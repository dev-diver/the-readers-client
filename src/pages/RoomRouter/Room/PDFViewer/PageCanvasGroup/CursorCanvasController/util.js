import socket from "socket";

export const canvasMouse = (event, info) => {
	if (!info.user) return;
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

	socket.emit("move-pointer", {
		...info,
		x: offsetX,
		y: offsetY,
	});
};

export const canvasMouseOut = (info) => {
	socket.emit("move-pointer", {
		delete: true,
		...info,
	});
};

export const updatePointers = (pointers, data) => {
	// 새로운 포인터 데이터 추가 또는 업데이트
	const index = pointers.findIndex((p) => p.user.id === data.user.id);
	if (data.delete) {
		pointers.splice(index, 1);
		return;
	} else if (index >= 0) {
		pointers[index] = data;
	} else {
		pointers.push(data);
	}
};

export const redrawCanvas = (canvas, pointers) => {
	if (!canvas.current) return;
	clearCanvas(canvas);
	pointers.forEach((p) => {
		drawOnCanvas(canvas, p.x, p.y, p.user.color);
	});
};

export const clearCanvas = (canvas) => {
	if (!canvas.current) return;
	const ctx = canvas.current.getContext("2d");
	ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
};

export function drawOnCanvas(canvas, x, y, color) {
	const ctx = canvas.current.getContext("2d");
	ctx.fillStyle = color; // 서버로부터 받은 색상 사용
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2, false);
	ctx.fill(); // 텍스트 그리기
}
