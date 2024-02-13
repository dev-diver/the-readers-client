import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";

const D3Graph = ({ heightId, data, width = 600, height = 400, onNodeClick = () => {} }) => {
	const [containerId] = useState(`d3graph-${uuidv4()}`);
	useEffect(() => {
		if (!data) return;

		d3.select(`#${containerId} svg`).remove();

		const svg = d3.select(`#${containerId}`).append("svg").attr("width", width).attr("height", height);

		// 화살표 마커 정의
		svg
			.append("defs")
			.selectAll("marker")
			.data(["end"]) // 마커 ID 설정
			.enter()
			.append("marker")
			.attr("id", "arrowhead")
			.attr("viewBox", "-0 -5 10 10") // 마커의 뷰박스 설정
			.attr("refX", 25) // 화살표가 노드 중심으로부터 얼마나 떨어져 있을지 설정
			.attr("refY", 0)
			.attr("orient", "auto")
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("xoverflow", "visible")
			.append("svg:path")
			.attr("d", "M 0,-5 L 10 ,0 L 0,5") // 화살표 모양 정의
			.attr("fill", "#999")
			.style("stroke", "none");

		const simulation = d3
			.forceSimulation(data.nodes)
			.force(
				"link",
				d3.forceLink(data.links).id((d) => d.id)
			)
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2));

		// 선(링크) 그리기
		const link = svg
			.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(data.links)
			.join("line")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.attr("stroke-width", (d) => Math.sqrt(d.value))
			.attr("marker-end", "url(#arrowhead)"); // 화살표 마커 적용

		// 노드 그룹 생성
		const node = svg.append("g").attr("class", "nodes").selectAll("g").data(data.nodes).join("g");

		node
			.append("rect")
			.attr("width", 40)
			.attr("height", 20)
			.attr("x", -20)
			.attr("y", -10)
			.attr("fill", color)
			.call(drag(simulation));

		node
			.append("text")
			.attr("dx", -10) // x 방향으로의 위치 조정
			.attr("dy", ".35em") // y 방향으로의 위치 조정
			.text(function (d) {
				return d.note;
			}) // 각 노드의 name 속성을 텍스트로 사용
			.style("fill", "black"); // 텍스트 색상

		simulation.on("tick", () => {
			// 링크와 노드의 위치 업데이트
			link
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);

			node.attr("transform", (d) => `translate(${d.x},${d.y})`);
		});

		function drag(simulation) {
			function dragstarted(event) {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				event.subject.fx = event.subject.x;
				event.subject.fy = event.subject.y;
			}

			function dragged(event) {
				event.subject.fx = event.x;
				event.subject.fy = event.y;
			}

			function dragended(event) {
				if (!event.active) simulation.alphaTarget(0);
				// event.subject.fx = null;
				// event.subject.fy = null;
			}

			return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
		}

		function color() {
			return "#C6E4FF";
		}
	}, [data, width, height, onNodeClick, containerId]);

	return <div id={containerId}></div>;
};

export default D3Graph;
