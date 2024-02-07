import React, { useState } from "react";

export function DraggableElement({ children }) {
	const [position, setPosition] = useState({ x: 500, y: 70 });
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const handleMouseDown = (e) => {
		setDragging(true);
		setOffset({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};
	const handleMouseMove = (e) => {
		if (dragging) {
			setPosition({
				x: e.clientX - offset.x,
				y: e.clientY - offset.y,
			});
		}
	};
	const handleMouseUp = () => {
		setDragging(false);
	};
	return (
		<div
			style={{ position: "absolute", left: position.x, top: position.y }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			{children}
		</div>
	);
}
