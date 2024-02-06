import { logger } from "logger";
import api from "api";
import React, { useRef, useEffect, useState } from "react";
import { rangeToInfo, InfoToRange, elemPageNum } from "./encoder";
import { useRecoilState } from "recoil";
import { userState } from "recoil/atom";
import socket from "socket.js";
import { Box } from "@mui/material";
// 진태 추가 코드
import { OptionsModal } from "components/OptionsModal";

function Highlighter({ bookId, renderContent, scrollerRef }) {
	const [user, setUser] = useRecoilState(userState);
	let highlightNum = 0;
	const [color, setColor] = useState("yellow");
	const [highlights, setHighlights] = useState([]);
	// 진태 Highlighter 컴포넌트에서 모달 상태 추가
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		const pageContainer = scrollerRef?.current;
		pageContainer?.addEventListener("mouseup", handleMouseUp);

		return () => {
			pageContainer?.removeEventListener("mouseup", handleMouseUp);
		};
	}, [scrollerRef?.current]);

	function applyUserHighlight(userId, bookId, pageNum) {
		api
			.get(`/highlights/user/${userId}/book/${bookId}/page/${pageNum}`)
			.then((response) => {
				logger.log("highlight", response.data);
				let highlights = [];
				response.data.forEach((hl, index) => {
					console.log(hl);
					const newRange = InfoToRange(hl);
					hl.num = highlightNum;
					highlightRange(newRange, userId);
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
				highlightRange(newRange, user.id);
			}

			console.log(highlights);
			appendHighlightMemo(highlightInfos[0]); //메모 작성
			sendHighlightToServer(highlightInfos[0]); // 형광펜 정보를 백엔드로 전송

			// 진태 모달 열기
			setModalOpen(true);
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

	function highlightRange(range, userId) {
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
			marker.setAttribute("data-highlight-num", highlightNum);
			marker.setAttribute("data-page-num", elemPageNum(range.startContainer));
			marker.setAttribute("data-user-id", userId);
			parentElement.replaceChild(marker, currentNode);
			marker.appendChild(currentNode);
			currentNode = nextNode;
		}
		highlightNum += 1;
		//마지막
	}

	function appendHighlightMemo(highlightInfos) {
		console.log("append");
		setHighlights((prevHighlights) => {
			console.log(prevHighlights);
			const newHighlightInfos = [...prevHighlights, highlightInfos].sort((a, b) => a.num - b.num);
			console.log(newHighlightInfos);
			return newHighlightInfos;
		});
	}

	return <HlMemos highlights={highlights} setHighlights={setHighlights} />;
}

const HlMemos = ({ highlights, setHighlights }) => {
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
				.delete(`/highlights/${hl.id}`)
				.then((response) => {
					logger.log(response);
				})
				.catch((err) => {
					logger.log(err);
				});

		const highlightNum = hl.num;
		const highlightMarks = document.querySelectorAll(`[data-highlight-num="${highlightNum}"]`);
		//highlightMarks를 감싸고 있는 mark를 제거
		highlightMarks.forEach((mark) => {
			const parent = mark.parentNode;
			while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
			parent.removeChild(mark);
		});
	};

	return (
		<>
			<OptionsModal open={modalOpen} onClose={() => setModalOpen(false)} highlightInfo={currentHighlightInfo} />
			<Box
				id="stored-highlights"
				ref={hlStorage}
				sx={{
					border: "black 1px solid",
					maxWidth: "100%", // Grid 아이템의 너비에 맞춰 최대 너비를 제한합니다.
					height: "100%", // Grid 아이템의 높이에 맞춰 최대 높이를 제한합니다.
					overflow: "auto",
				}}
			>
				<Box>하이라이트</Box>
				{memos}
			</Box>
		</>
	);
};

function HlMemo({ hlInfo, deleteHandler }) {
	const displayLength = 100;

	const displayText =
		hlInfo.text.length > displayLength ? hlInfo.text.substring(0, displayLength) + "..." : hlInfo.text;
	return (
		<div>
			<div data-highlight-num={hlInfo.num} data-page-num={hlInfo.pageNum}>
				{displayText}
			</div>
			<button onClick={deleteHandler}>일부 삭제</button>
		</div>
	);
}

export default Highlighter;
