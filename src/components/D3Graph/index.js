import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";
import api from "api";
import { Tooltip } from "@mui/material";

import "./style.css";

const D3Graph = ({ highlightId, data, width, height, onNodeClick }) => {
	const navigate = useNavigate(); // useNavigate 훅 사용
	const [containerId] = useState(`d3graph-${uuidv4()}`);
	const [nodeTexts, setNodeTexts] = useState([]);
	const [tooltipInfo, setTooltipInfo] = useState({ open: false, text: "", x: 0, y: 0 });

	useEffect(() => {
		const fetchAllNodeTexts = async () => {
			const texts = {};
			for (const node of data.nodes) {
				try {
					const response = await api.get(`/highlights/${node.id}`);
					if (response.data && response.data.data) {
						texts[node.id] = response.data.data.text; // 객체 업데이트
					}
				} catch (error) {
					console.error(`Failed to fetch highlight for node ${node.id}`, error);
				}
			}
			setNodeTexts(texts);
		};

		if (data.nodes && data.nodes.length > 0) {
			fetchAllNodeTexts();
		}
	}, [data.nodes]);

	useEffect(() => {
		// if (!data) return;
		if (!data || data.nodes.length === 0) return;

		// 중심 노드 ID, 예를 들어 highlightId 변수를 사용
		const centralNodeId = highlightId;

		// 중심 노드의 위치를 화면 중앙으로 고정
		const centralNode = data.nodes.find((node) => node.id == centralNodeId);
		if (centralNode) {
			centralNode.fx = width / 2;
			centralNode.fy = height / 2;
		}

		// console.log("Link data with notes:", data.links[0].note);

		// 노드에 무작위 초기 위치 할당
		data.nodes.forEach((node) => {
			node.x = Math.random() * width;
			node.y = Math.random() * height;
		});

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

		// 연결 선(link) 설정
		const link = svg
			.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(data.links)
			.enter()
			.append("line")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.attr("stroke-width", (d) => Math.sqrt(d.value))
			.attr("marker-end", "url(#arrowhead)"); // 화살표 마커 적용

		// 연결 선 위의 텍스트(note) 설정
		const linkText = svg
			.append("g")
			.attr("class", "link-notes")
			.selectAll("text")
			.data(data.links)
			.enter()
			.append("text")
			.attr("class", "link-note")
			.attr("text-anchor", "middle")
			.attr("font-size", "15px")
			.attr("font-weight", "lighter")
			.style("fill", "blue")
			.text((d) => d.note || "")
			.each(function (d) {
				// 여기에서 d는 바인딩된 데이터입니다.
				console.log("Link data:", d.note); // 콘솔에 데이터 출력
			});

		// 처음 노드가 로딩될 때 퍼지는 정도를 조절하는 부분
		const simulation = d3
			.forceSimulation(data.nodes)
			.force(
				"link",
				d3
					.forceLink(data.links)
					.id((d) => d.id)
					.distance(200)
			) // 링크 거리 조정
			.force("charge", d3.forceManyBody().strength(-500)) // 반발력 조정
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("collide", d3.forceCollide(50).strength(1)) // 충돌 반경 설정
			.alpha(1) // 초기 열량 설정
			.alphaDecay(0.02); // 열량 감소율 조정// 노드의 초기 위치를 랜덤화하는 방법
		data.nodes.forEach((node) => {
			node.x = Math.random() * width;
			node.y = Math.random() * height;
		});

		// 노드 그룹 생성
		const node = svg.append("g").attr("class", "nodes").selectAll("g").data(data.nodes).join("g");

		// 노드 클릭 이벤트 리스너 추가
		node.on("click", (event, d) => {
			console.log("Node clicked:", d);
			if (d.isOuterLink && d.url) {
				// 외부 링크인 경우, 새 탭에서 URL 열기
				window.open(d.url, "_blank");
			} else {
				// 내부 링크인 경우, 정의된 URL 형식에 맞춰 이동
				// 여기서는 room, book의 ID가 고정되어 있다고 가정합니다.
				// 실제 사용 시에는 이 값들을 동적으로 대체해야 할 수 있습니다.
				// const roomId = 1; // 가정: 현재 방의 ID
				// const bookId = 1; // 가정: 현재 책의 ID
				const highlightId = d.id; // 클릭된 노드의 ID (하이라이트 ID)

				onNodeClick(highlightId); // 노드 클릭 이벤트 핸들러 호출
			}
		});

		// 사각형으로 랜더링
		// node
		// 	.append("rect")
		// 	.attr("width", 40)
		// 	// .attr("width", (d) => {
		// 	// 	// nodeTexts에서 현재 노드의 ID를 사용해 텍스트를 검색
		// 	// 	const text = nodeTexts[d.id] || "";
		// 	// 	// 텍스트 길이에 따라 rect의 너비를 계산, 최소 너비는 40
		// 	// 	return Math.max(40, text.length * 6); // 여기서 6은 대략적인 글자 너비입니다.
		// 	// })
		// 	.attr("height", 20)
		// 	.attr("x", -20)
		// 	.attr("y", -10)
		// 	.attr("fill", (d) => (d.isOuterLink ? "#99FFA9" : "#C6E4FF")) // 내부 링크와 외부 링크 색상 변경
		// 	.call(drag(simulation));

		node
			.append("circle")
			.attr("r", (d) => (d.id === highlightId ? 30 : 20))
			.attr("fill", (d) => (d.isOuterLink ? "#99FFA9" : "#C6E4FF"))
			.on("mouseenter", (event, d) => {
				const [x, y] = d3.pointer(event);
				const text = d.isOuterLink ? d.note || "No note" : nodeTexts[d.id] || "No text";

				setTooltipInfo({
					open: true,
					text: text,
					x: x + event.target.getBoundingClientRect().x,
					y: y + event.target.getBoundingClientRect().y,
				});
			})
			.on("mouseleave", () => {
				setTooltipInfo({ ...tooltipInfo, open: false });
			})
			.call(drag(simulation));

		// 노드 안에 text가 랜더링되는 방식
		// node
		// 	.append("text")
		// 	.attr("dx", -10) // x 방향으로의 위치 조정
		// 	.attr("dy", ".35em") // y 방향으로의 위치 조정
		// 	.text((d) => {
		// 		// 외부 링크인 경우, 사용자가 작성한 메모를 표시
		// 		if (d.isOuterLink) {
		// 			return d.note || ""; // 메모가 없는 경우 빈 문자열로 표시
		// 		} else {
		// 			// 내부 링크인 경우, 기존 논리에 따라 텍스트를 결정 (예: 하이라이트 텍스트)
		// 			return nodeTexts[d.id] || "No text"; // 하이라이트 텍스트가 없는 경우 "No text" 표시
		// 		}
		// 	})
		// 	.style("fill", "black") // 텍스트 색상
		// 	.style("font-weight", (d) => (d.id == highlightId ? "bold" : "normal")) // 중심 노드 볼드 처리
		// 	.style("font-size", (d) => (d.id == highlightId ? "20px" : "15px")) // 중심 노드 글자 크기 조정
		// 	.each(function (d) {
		// 		console.log("Node data:", nodeTexts[d.id]); // 콘솔에 데이터 출력
		// 	});

		simulation.on("tick", () => {
			// 링크와 노드의 위치 업데이트
			link
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);

			linkText
				.attr("x", (d) => (d.source.x + d.target.x) / 2)
				.attr("y", (d) => (d.source.y + d.target.y) / 2)
				.attr("dy", 5);

			node.attr("transform", (d) => {
				d.x = Math.max(40, Math.min(width - 10, d.x)); // 화면 가로 경계 내로 제한
				d.y = Math.max(20, Math.min(height - 10, d.y)); // 화면 세로 경계 내로 제한
				return `translate(${d.x},${d.y})`;
			});
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
				event.subject.fx = null;
				event.subject.fy = null;
			}

			return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
		}

		function color() {
			return "#C6E4FF";
		}
	}, [data, width, height, onNodeClick, containerId, nodeTexts, navigate]);

	// return <div id={containerId} style={{ width: "900px", height: "400px" }}></div>;
	return (
		<>
			<div id={containerId} style={{ width: "900px", height: "400px" }}></div>
			{tooltipInfo.open && (
				<Tooltip
					open={tooltipInfo.open}
					title={tooltipInfo.text}
					PopperProps={{
						anchorEl: {
							clientHeight: 0,
							clientWidth: 0,
							getBoundingClientRect: () => ({
								top: tooltipInfo.y,
								left: tooltipInfo.x,
								right: tooltipInfo.x,
								bottom: tooltipInfo.y,
								width: 0,
								height: 0,
							}),
						},
					}}
					placement="top"
					componentsProps={{
						tooltip: {
							sx: {
								// color: "purple",	// 글자색 우선은 안바꿈
								// backgroundColor: "lightblue",	// 배경색 우선은 안바꿈
								fontSize: "2em",
							},
						},
					}}
				/>
			)}
		</>
	);
};

export default D3Graph;
