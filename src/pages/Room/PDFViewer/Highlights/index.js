import { logger } from "logger";
import api from "api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { rangeToInfo, InfoToRange, eraseHighlight, drawHighlight } from "./util";
import { useRecoilState } from "recoil";
import { userState, scrollerRefState, highlightState } from "recoil/atom";
import socket from "socket.js";
import "./styles.css";

import HighlightList from "./HighlightList";
// 진태 추가 코드
import OptionsModal from "components/OptionsModal";
import InsertLink from "components/OptionsModal/InsertLink";
import InsertMemo from "components/OptionsModal/InsertMemo";
import InsertHighlight from "components/OptionsModal/InsertHighlight";

function Highlighter({ bookId, renderContent }) {
	const { roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [color, setColor] = useState("yellow");

	// 진태 추가 코드
	const [optionsModalOpen, setOptionsModalOpen] = useState(false);
	const [highlightId, setHighlightId] = useState(null);
	const [userId, setUserId] = useState(null);
	const [highlightInfos, setHighlightInfos] = useState(null);

	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);

	useEffect(() => {
		scrollerRef?.addEventListener("mouseup", selectionToHighlight);
		return () => {
			scrollerRef?.removeEventListener("mouseup", selectionToHighlight);
		};
	}, [scrollerRef, user]);

	useEffect(() => {
		setHighlightList([]);
	}, [bookId]);

	const selectionToHighlight = () => {
		if (!user) {
			alert("하이라이팅은 로그인이 필요합니다.");
			return;
		}
		const selectedRange = window.getSelection();

		if (selectedRange.rangeCount > 0 && !selectedRange.isCollapsed) {
			const highlightInfos = [];

			for (let i = 0; i < selectedRange.rangeCount; i++) {
				const range = selectedRange.getRangeAt(i);
				const additionalInfo = { bookId: bookId, text: selectedRange.toString() };
				const highlightInfo = rangeToInfo(range, additionalInfo);
				console.log("highlightInfo", highlightInfo);
				highlightInfos.push(highlightInfo);
			}

			// mouseup 이벤트가 발생하면 selectionToHighlight 함수가 실행되고
			// setOptionsModalOpen(true)로 모달이 열림.
			setOptionsModalOpen(true);
			setHighlightInfos(highlightInfos);

			// 형한테 확인 받기
			highlightInfos.forEach(async (highlightInfo) => {
				const newRange = InfoToRange(highlightInfo);
				// const highlightId = await sendHighlightToServer(highlightInfo); // 형광펜 서버로 전송
				console.log("highlightId", highlightId);
				highlightInfo = {
					...highlightInfo,
					id: highlightId,
					roomId: roomId,
					userId: user.id,
				};
				socket.emit("insert-highlight", highlightInfo); //소켓에 전송
				const drawHighlightInfo = {
					id: highlightId,
					userId: user.id,
					color: color,
				};

				// drawHighlight(newRange, drawHighlightInfo); // 형관펜 화면에 그림
				// appendHighlightListItem(highlightInfo); //형광펜 리스트 생성
			});
		}

		selectedRange.removeAllRanges();
	};

	useEffect(() => {
		if (user) {
			socket.on("room-users-changed", (data) => {
				console.log("room-users-changed", data);
				data.forEach((roomUser) => {
					const pageNum = 1; //레이지로드 전까지는 1로 해도 전체 가져옴
					if (roomUser.userId !== user.id) {
						applyServerHighlight(roomUser.userId, bookId, pageNum, "pink");
					}
				});
			});
		}
		return () => {
			socket.off("room-users-changed");
		};
	}, [user]);

	useEffect(() => {
		socket.on("draw-highlight", (data) => {
			console.log("draw-highlight", data);
			const newRange = InfoToRange(data);
			const drawHighlightInfo = {
				id: data.id,
				userId: data.userId,
				color: "pink",
			};
			drawHighlight(newRange, drawHighlightInfo);
		});
		return () => {
			socket.off("draw-highlight");
		};
	}, [user]);

	useEffect(() => {
		socket.on("erase-highlight", (data) => {
			console.log("erase-highlight", data);
			eraseHighlight(data.id);
		});
		return () => {
			socket.off("erase-highlight");
		};
	}, [user]);

	useEffect(() => {
		if (renderContent) {
			const pageNum = 1;
			if (user) {
				applyServerHighlight(user.id, bookId, pageNum, color);
			}
		}
	}, [renderContent, user]);

	/* Server */
	const applyServerHighlight = (userId, bookId, pageNum, color) => {
		api
			.get(`/highlights/user/${userId}/book/${bookId}/page/${pageNum}`)
			.then((response) => {
				logger.log("highlight", response.data);
				let highlights = [];
				response.data.forEach((highlightInfo) => {
					const newRange = InfoToRange(highlightInfo);
					const drawHighlightInfo = {
						id: highlightInfo.id,
						userId: userId,
						color: color,
					};
					drawHighlight(newRange, drawHighlightInfo);
					if (userId == user?.id) {
						highlights.push(highlightInfo);
					}
				});
				if (userId == user?.id) {
					setHighlightList(highlights);
				}
			})
			.catch((err) => {
				logger.log(err);
			});
	};

	const sendHighlightToServer = async (highlightInfo) => {
		console.log("user", user, highlightInfo);
		if (!user) {
			return null; // 세미콜론은 여기서 선택적이지만, 명확성을 위해 사용할 수 있습니다.
		}
		return api
			.post(`/highlights/user/${user.id}`, highlightInfo)
			.then((response) => {
				logger.log(response);
				const highlightId = response.data.data[0].HighlightId;
				setHighlightId(highlightId);
				return highlightId;
			})
			.catch((err) => {
				logger.log(err);
				return null; // 에러 처리 후, 명시적으로 null 반환
			}); // Promise 체인이 끝나는 곳에 세미콜론 사용
	};

	/* Highlight List Item */

	const appendHighlightListItem = (highlightInfo) => {
		console.log("append");
		setHighlightList((prevHighlights) => {
			console.log(prevHighlights);
			const newHighlightInfos = [...prevHighlights, highlightInfo].sort((a, b) => a.num - b.num);
			console.log(newHighlightInfos);
			return newHighlightInfos;
		});
	};

	const deleteHighlightListItem = (highlightInfo) => {
		setHighlightList(highlightList.filter((h) => h.id !== highlightInfo.id));

		api
			.delete(`/highlights/${highlightInfo.id}`)
			.then((response) => {
				logger.log(response);
			})
			.catch((err) => {
				logger.log(err);
			});

		eraseHighlight(highlightInfo.id);
		socket.emit("delete-highlight", { roomId: roomId, ...highlightInfo });
	};

	return (
		<>
			<HighlightList highlights={highlightList} deleteHandler={deleteHighlightListItem} />
			{/* 조건부 랜더링 : optionsModalOpen이 true되면 OptionsModal이 화면에 랜더링됨. */}
			{optionsModalOpen && (
				<OptionsModal
					isOpen={optionsModalOpen}
					onClose={() => setOptionsModalOpen(false)}
					user={user}
					userId={user.id}
					highlightId={highlightId}
					setHighlightId={setHighlightId}
					bookId={bookId}
					roomId={roomId}
					color={color}
					drawHighlight={drawHighlight}
					appendHighlightListItem={appendHighlightListItem}
					sendHighlightToServer={sendHighlightToServer}
					selectedHighlightInfo={highlightInfos} // selectedHighlightInfo를 OptionsModal에 전달
				/>
			)}
		</>
	);
}

export default Highlighter;
