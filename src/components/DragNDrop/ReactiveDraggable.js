import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { widthState } from "recoil/atom"; // 필요한 Recoil 상태

export default function ReactiveDraggable({ children, startX, startY }) {
	const [position, setPosition] = useState({ x: startX, y: startY });
	const [width, setWidth] = useRecoilState(widthState); // widthState 사용
	const [dragging, setDragging] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [layout, setLayout] = useState("vertical");

	// 드래그 위치에 따른 레이아웃 조정
	useEffect(() => {
		const handleMouseMove = (e) => {
			// 드래그 위치에 따라 레이아웃 상태를 업데이트합니다.
			if (dragging) {
				// 화면 너비와 높이의 1/4 값을 계산
				const quarterWidth = window.innerWidth / 4;
				const quarterHeight = window.innerHeight / 4;

				// 1행의 1열, 2열, 3열 영역을 정의 (화면 상단 1/4 내에서, 왼쪽부터 3/4 지점까지)
				const isInFirstRow = e.clientY <= quarterHeight; // 1행 여부
				const isInFirstThreeColumns = e.clientX <= quarterWidth * 3; // 1열, 2열, 3열 여부

				// 드래그 위치가 1행의 1열, 2열, 3열 영역 내에 있는지 확인
				if (isInFirstRow && isInFirstThreeColumns) {
					// 해당 영역 내에 있으면 레이아웃을 가로 모드로 설정
					setLayout("horizontal");
				} else {
					// 그 외의 영역이면 레이아웃을 세로 모드로 설정 (또는 다른 로직 적용)
					setLayout("vertical");
				}

				// 드래그 이동에 따른 위치 업데이트
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

	// 레이아웃에 따른 스타일 조정
	const layoutStyle = layout === "horizontal" ? { flexDirection: "row" } : { flexDirection: "column" };

	return (
		<div
			style={{
				display: "flex",
				// position: "absolute",
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: dragging ? "grabbing" : "grab",
				...layoutStyle,
			}}
			onMouseDown={handleMouseDown}
		>
			{children}
		</div>
	);
}
