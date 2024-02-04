import { logger } from "logger";
import api from "api";
import React, { useRef, useEffect, useState } from "react";
import { rangeToInfo, InfoToRange } from "./encoder";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";
import socket from "socket.js";

function Highlighter({ bookId, renderContent, containerRef }) {
	const [user, setUser] = useRecoilState(userState);
	const [highlightNum, setHighlightId] = useState(1);
	const [color, setColor] = useState("yellow");
	const [highlights, setHighlights] = useState([]);

	useEffect(() => {
		const pageContainer = containerRef?.current;
		pageContainer?.addEventListener("mouseup", handleMouseUp);

		return () => {
			pageContainer?.removeEventListener("mouseup", handleMouseUp);
		};
	}, [containerRef?.current]);

	function applyUserHighlight(userId, bookId, pageNum) {
		api
			.get(`/highlights/user/${userId}/book/${bookId}/page/${pageNum}`)
			.then((response) => {
				logger.log("highlight", response.data);
				let highlights = [];
				response.data.forEach((hl) => {
					console.log(hl);
					const newRange = InfoToRange(hl);
					highlightRange(newRange);
					highlights.push(hl);
				});
				setHighlights(highlights);
			})
			.catch((err) => {
				logger.log(err);
			});
	}

	useEffect(() => {
		socket.on("users", (data) => {
			// 각 사용자의 userId와 bookId를 조합하여 canvasId를 생성
			data.forEach((socketUser) => {
				const pageNum = 1;
				if (socketUser.memberId && socketUser.memberId === user?.id) {
					console.log(socketUser);
					applyUserHighlight(socketUser.memberId, bookId, pageNum);
				}
			});
		});
	}, []);

	useEffect(() => {
		if (renderContent) {
			const pageNum = 1;
			if (user) {
				console.log(user);
				applyUserHighlight(user.id, bookId, pageNum);
			}
		}
	}, [renderContent, user]);

	const handleMouseUp = () => {
		const selectedRange = window.getSelection();

		if (selectedRange.rangeCount > 0 && !selectedRange.isCollapsed) {
			const highlightInfos = [];

			for (let i = 0; i < selectedRange.rangeCount; i++) {
				const range = selectedRange.getRangeAt(i);

				const additionalInfo = { bookId: bookId, num: highlightNum, text: selectedRange.toString() };
				const highlightInfo = rangeToInfo(range, additionalInfo);
				// 형광펜 정보 저장
				highlightInfos.push(highlightInfo);
				const newRange = InfoToRange(highlightInfo);
				highlightRange(newRange);
			}
			// 형광펜 정보를 백엔드로 전송
			appendHighlightMemo(highlightInfos[0]);
			sendHighlightToServer(highlightInfos[0]);
		}
		selectedRange.removeAllRanges();
	};

	function sendHighlightToServer(highlightInfos) {
		if (user) {
			api
				.post(`/highlights/user/${user.id}`, highlightInfos)
				.then((response) => {
					//id가 포함된 highlights
					logger.log(response);
					//updatehighlight
				})
				.catch((err) => {
					logger.log(err);
				});
		}
	}

	function highlightRange(range) {
		let passNode = false;

		const filterFunction = function (node) {
			if (node.hasChildNodes() || node.nodeType !== Node.TEXT_NODE) {
				return NodeFilter.FILTER_SKIP;
			}

			if (node === range.startContainer) {
				passNode = true;
				return NodeFilter.FILTER_SKIP;
			}

			if (node === range.endContainer) {
				passNode = false;
				return NodeFilter.FILTER_SKIP;
			}

			const filterState = passNode ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

			return filterState;
		};

		const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, filterFunction);

		let parentElement;

		//range.startContainer 의 range.startOffset 부터 range.startContainer 의 끝까지를 mark로 감싸는 코드

		//중간
		let currentNode = walker.nextNode();
		while (currentNode) {
			const nextNode = walker.nextNode();
			parentElement = currentNode.parentNode;

			const marker = document.createElement("mark");
			marker.classList.add(color);
			parentElement.replaceChild(marker, currentNode);
			marker.appendChild(currentNode);
			currentNode = nextNode;
		}

		//마지막
	}

	function appendHighlightMemo(highlightInfos) {
		console.log("append");
		console.log(highlights);
		let newHighlightInfos = highlights.concat(highlightInfos).sort((a, b) => {
			a.num - b.num; //추후 위치로 정렬
		});
		console.log(newHighlightInfos);
		setHighlights(newHighlightInfos);
		setHighlightId(highlightNum + 1);
	}
	return <HlMemos highlights={highlights} setHighlights={setHighlights} />;
}

function HlMemos({ highlights, setHighlights }) {
	const hlStorage = useRef(null);
	const [memos, setMemos] = useState([]);

	useEffect(() => {
		const newHighlights = highlights?.map(
			(hl, i) => <HlMemo key={i} hlInfo={hl} deleteHandler={() => deleteOneHighlight(hl)} /> || []
		);
		setMemos(newHighlights);
	}, [highlights]);

	const deleteOneHighlight = (hl) => {
		setHighlights(highlights.filter((h) => h.num !== hl.num));

		hl.id &&
			api
				.delete(`/highlight/${hl.id}`)
				.then((response) => {
					logger.log(response);
				})
				.catch((err) => {
					logger.log(err);
				});
	};

	return (
		<div id="stored-highlights" ref={hlStorage} style={{ border: "black 1px solid" }}>
			<h3>하이라이트</h3>
			{memos}
		</div>
	);
}

function HlMemo({ hlInfo, deleteHandler }) {
	return (
		<div>
			<div id={`hl_${hlInfo.pageNum}_${hlInfo.num}`}>저장된 부분: {hlInfo.text}</div>
			<button onClick={deleteHandler}>일부 삭제</button>
		</div>
	);
}

export default Highlighter;
