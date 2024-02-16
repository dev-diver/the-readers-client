import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { widthState } from "recoil/atom";

export function DraggableElement({ children, startX, startY }) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [width, setWidth] = useRecoilState(widthState);
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	// 펜 컨트롤러 위치 계산
	useEffect(() => {
		const updatePosition = () => {
			// 브라우저 창의 너비를 기준으로 x 위치를 계산합니다.
			const x = startX; //window.innerWidth / 2 - width / 2; // width는 펜 컨트롤러의 너비
			const y = startY; // y 위치는 고정값 사용

			setPosition({ x, y });
		};

		// 컴포넌트 마운트 시 위치 업데이트
		updatePosition();

		// 윈도우 크기가 변경될 때마다 위치 업데이트
		// window.addEventListener("resize", updatePosition);

		// // 이벤트 리스너 정리
		// return () => window.removeEventListener("resize", updatePosition);
	}, [width]);

	useEffect(() => {
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

		if (dragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [dragging, offset]);

	const handleMouseDown = (e) => {
		setDragging(true);
		setOffset({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
	};

	return (
		<div
			style={{
				position: "absolute",
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: dragging ? "grabbing" : "grab",
			}}
			onMouseDown={handleMouseDown}
		>
			{children}
		</div>
	);
}
