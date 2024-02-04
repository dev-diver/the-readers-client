import React, { useState, useEffect, PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { logger } from "logger";

const original_data = new Array(31).fill(0).map((_, index) => ({
	page: `${index}`,
	time: 0,
}));

let updatedData = {};

function Chart({ scroll }) {
	const [prevScroll, setPrevScroll] = useState(0);
	const [data, setData] = useState(original_data);
	const [count, setCount] = useState(0);

	useEffect(() => {
		setPrevScroll(scroll);
		// 1초마다 count 증가
		const interval = setInterval(() => {
			setCount((c) => c + 1);
		}, 1000);

		// 컴포넌트가 언마운트될 때 인터벌 정리
		return () => clearInterval(interval);
	}, [scroll]);

	// count는 스크롤 이벤트가 한 번 발생한 이후부터 시작. 그 전엔 카운트 안 셈.
	// data에서 prevScroll에 해당하는 값이 time 키와 같을 때 그 값을 1초에 1씩 증가시킴
	// count가 prevScroll 값이 바뀔 때마다 0으로 초기화되는 기능 포함

	useEffect(() => {
		updatedData = data.map((item) => {
			if (Number(item.page) === prevScroll) {
				// data의 parseInt(item.page)과 같은 값의 page를 찾아 time을 count만큼 증가시킴
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

	return (
		// width="25%" height={650} style={{ position: "sticky", top: "20px" }}
		<ResponsiveContainer>
			<LineChart
				layout="vertical"
				width={400}
				height={800}
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

export default Chart;
