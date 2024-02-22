import React, { useState } from "react";
import "./style.css";

function BookCarousel({ initialItems, initialActive }) {
	const [activeIndex, setActiveIndex] = useState(initialActive);

	// 왼쪽 화살표 클릭 핸들러
	const moveLeft = () => {
		setActiveIndex((prevActiveIndex) => (prevActiveIndex - 1 < 0 ? initialItems.length - 1 : prevActiveIndex - 1));
	};

	// 오른쪽 화살표 클릭 핸들러
	const moveRight = () => {
		setActiveIndex((prevActiveIndex) => (prevActiveIndex + 1) % initialItems.length);
	};

	// 모든 책 커버 렌더링
	const generateItems = () => {
		return initialItems.map((item, index) => {
			// 활성화된 아이템을 중앙에 놓기 위한 계산
			let level = index - activeIndex;

			// 배열 범위를 넘어간 경우 처리
			if (level < -2) {
				level += initialItems.length;
			} else if (level > 2) {
				level -= initialItems.length;
			}

			return (
				<div key={item.id} className={`item level${level}`}>
					<img src={item.image} alt={item.title || "Book Cover"} style={{ width: "100%", height: "auto" }} />
					{item.title && <p>{item.title}</p>}
				</div>
			);
		});
	};

	return (
		<div id="carousel" className="noselect" style={{ margin: "30px" }}>
			<div className="arrow arrow-left" onClick={moveLeft}>
				&lt;
			</div>
			<div className="carousel-container">{generateItems()}</div>
			<div className="arrow arrow-right" onClick={moveRight}>
				&gt;
			</div>
		</div>
	);
}

export default BookCarousel;
