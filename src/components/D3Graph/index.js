import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { v4 as uuidv4 } from "uuid";
import api from "api";
import "./style.css";

const D3Graph = ({ highlightId, data, width, height, onNodeClick = () => {} }) => {
	const navigate = useNavigate(); // useNavigate 훅 사용
	const [containerId] = useState(`d3graph-${uuidv4()}`);
	const [nodeTexts, setNodeTexts] = useState([]);
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
		if (!data) return;

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
			.style("fill", "black")
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
			.force("collide", d3.forceCollide(50)) // 충돌 반경 설정
			.alpha(1) // 초기 열량 설정
			.alphaDecay(0.02); // 열량 감소율 조정

		// 노드 그룹 생성
		const node = svg.append("g").attr("class", "nodes").selectAll("g").data(data.nodes).join("g");

		// 노드 클릭 이벤트 리스너 추가
		node.on("click", (event, d) => {
			console.log("Node clicked:", d);
			if (d.isOuterLink && d.url) {
				// 외부 링크인 경우, 새 탭에서 URL 열기
				window.open(d.url, "_blank");
			} else {
				// 내부 링크인 경우, useNavigate로 해당 경로로 이동
				navigate(`/highlights/${d.id}`);
			}
		});

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
			// .text(function (d) {
			// 	return nodeTexts[d.id] || "No text"; // 텍스트가 없을 경우 "No text" 출력
			// }) // nodeTexts 객체에서 텍스트 검색
			.text((d) => {
				// 외부 링크인 경우, 사용자가 작성한 메모를 표시
				if (d.isOuterLink) {
					return d.note || ""; // 메모가 없는 경우 빈 문자열로 표시
				} else {
					// 내부 링크인 경우, 기존 논리에 따라 텍스트를 결정 (예: 하이라이트 텍스트)
					return nodeTexts[d.id] || "No text"; // 하이라이트 텍스트가 없는 경우 "No text" 표시
				}
			})
			.style("fill", "black") // 텍스트 색상
			.each(function (d) {
				console.log("Node data:", nodeTexts[d.id]); // 콘솔에 데이터 출력
			});

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
				.attr("dy", 5); // dy는 텍스트를 선 위로 조금 올리기 위해 사용됩니다.

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
				event.subject.fx = null;
				event.subject.fy = null;
			}

			return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
		}

		function color() {
			return "#C6E4FF";
		}
	}, [data, width, height, onNodeClick, containerId, nodeTexts, navigate]);

	return <div id={containerId} style={{ width: "900px", height: "400px" }}></div>;
};

export default D3Graph;
