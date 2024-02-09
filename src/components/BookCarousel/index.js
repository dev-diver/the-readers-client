import React, { useState } from "react";
import "./style.css";
import { TransitionGroup } from "react-transition-group";

// initialItems: 캐러셀에 표시될 책 커버 이미지의 배열(id, title, image 포함)
// initialActive: 캐러셀에서 처음 활성화된 책 커버의 인덱스 (0부터 시작)
function BookCarousel({ initialItems, initialActive }) {
	// items: 현재 캐러셀에 표시되는 책 커버 이미지의 배열
	// activeIndex: 현재 활성화된 책 커버의 인덱스
	// direction: 캐러샐이 이동하는 방향 (left, right)
	const [items, setItems] = useState(initialItems);
	const [activeIndex, setActiveIndex] = useState(initialActive);
	const [direction, setDirection] = useState("");

	// items 배열을 순회하며 책 커버 이미지를 화면에 렌더링
	// 활성화된 책 커버 이미지를 중심으로 좌우로 2개씩 총 5개의 책 커버 이미지를 표시함
	const generateItems = () => {
		let itemsComponents = [];
		for (let i = activeIndex - 2; i < activeIndex + 3; i++) {
			let index = i < 0 ? items.length + i : i >= items.length ? i % items.length : i;
			let level = activeIndex - i;
			itemsComponents.push(<Item key={items[index].id} item={items[index]} level={level} />);
		}
		return itemsComponents;
	};

	// 왼쪽 화살표를 클릭했을 때 실행되는 함수
	// activeIndex를 감소시켜서 이전 책 커버 이미지를 활성화함
	const moveLeft = () => {
		setActiveIndex((prevActiveIndex) => (prevActiveIndex - 1 < 0 ? items.length - 1 : prevActiveIndex - 1));
		setDirection("left");
	};

	// 오른쪽 화살표를 클릭했을 때 실행되는 함수
	// activeIndex를 증가시켜서 다음 책 커버 이미지를 활성화함
	const moveRight = () => {
		setActiveIndex((prevActiveIndex) => (prevActiveIndex + 1) % items.length);
		setDirection("right");
	};

	// 캐러셀을 렌더링
	// 왼쪽, 오른쪽 화살표와 책 커버 이미지를 포함함
	return (
		<div id="carousel" className="noselect" style={{ margin: "30px" }}>
			<div className="arrow arrow-left" onClick={moveLeft}>
				&lt;
			</div>
			<TransitionGroup component="div" className={`carousel ${direction}`}>
				{generateItems()}
			</TransitionGroup>
			<div className="arrow arrow-right" onClick={moveRight}>
				&gt;
			</div>
		</div>
	);
}

// 책 커버 이미지를 렌더링
// item: 책 커버 이미지 정보
// level: 책 커버 이미지의 레벨 (활성화된 항목으로부터의 거리)
function Item({ item, level }) {
	const className = `item level${level}`;
	return (
		<div className={className}>
			<img src={item.image} alt={item.title || "Book Cover"} style={{ width: "100%", height: "auto" }} />
			{/* Optional: Display the title if available */}
			{item.title && <p>{item.title}</p>}
		</div>
	);
}

export default BookCarousel;
