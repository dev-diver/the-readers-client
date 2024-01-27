import React, { useState, useEffect, PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { debounce } from "lodash";

const original_data = new Array(11).fill(0).map((_, index) => ({
	page: `${index}`,
	time: 0,
}));

let updatedData = {};

function Chart() {
	const [prevScroll, setPrevScroll] = useState(0);
	const [scroll, setScroll] = useState(calculateScrollY());
	const [data, setData] = useState(original_data);
	const [count, setCount] = useState(0);

	const handleScroll = debounce(() => {
		console.log("debounce", scroll);
		// setPrevScroll(scroll);
		setScroll(calculateScrollY());
	}, 1000);

	useEffect(() => {
		const pageContainer = document.getElementById("page-container");

		// 스크롤 이벤트 리스너 추가
		pageContainer.addEventListener("scroll", () => handleScroll());
		// 컴포넌트가 언마운트될 때 리스너 제거
		return () => pageContainer.removeEventListener("scroll", () => handleScroll());
	}, []);

	useEffect(() => {
		setPrevScroll(scroll);
		console.log("[scroll] scroll: ", scroll);
		console.log("[scroll] PrevScroll: ", prevScroll);
		// 1초마다 count 증가
		const interval = setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);

		// 컴포넌트가 언마운트될 때 인터벌 정리
		return () => clearInterval(interval);
	}, [scroll]);

	useEffect(() => {
		console.log("time(count): ", count);
	}, [scroll]);

	// count는 스크롤 이벤트가 한 번 발생한 이후부터 시작. 그 전엔 카운트 안 셈.
	// data에서 prevScroll에 해당하는 값이 time 키와 같을 때 그 값을 1초에 1씩 증가시킴
	// count가 prevScroll 값이 바뀔 때마다 0으로 초기화되는 기능 포함

	useEffect(() => {
		updatedData = data.map((item) => {
			if (item.page && parseInt(item.page) === prevScroll) {
				// data의 parseInt(item.page)과 같은 값의 page를 찾아 time을 count만큼 증가시킴

				console.log("the item in data");
				console.log("item.page: ", item.page);
				console.log("item.time: ", item.time);

				const count_tmp = count;
				setCount(0);

				return {
					...item,
					time: item.time + count_tmp,
				};
			}
			return item;
		});

		setData(updatedData);
	}, [scroll]);

	useEffect(() => {
		console.log("2. prev page", prevScroll);
		console.log("*********");
	}, [prevScroll]);

	return (
		<ResponsiveContainer width="20%" height="85%" style={{ position: "sticky", top: "20px" }}>
			<LineChart
				layout="vertical"
				width={500}
				height={300}
				data={updatedData}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis type="number" />
				<YAxis dataKey="page" type="category" />
				<Tooltip />
				<Legend />
				<Line dataKey="time" stroke="#8884d8" />
			</LineChart>
		</ResponsiveContainer>
	);
}

function calculateScrollY() {
	const pageContainer = document.getElementById("page-container");
	if (!pageContainer) return 0;

	const scrollY = pageContainer.scrollTop;
	const containerHeight = pageContainer.scrollHeight;
	const clientHeight = pageContainer.clientHeight;
	const totalScrollableHeight = containerHeight - clientHeight;
	// (스크롤 위치 / 전체 스크롤 가능한 길이) * 10 = (전체 길이상대적인 스크롤 위치)
	return Math.round((scrollY / totalScrollableHeight) * 10);
}

export default Chart;
