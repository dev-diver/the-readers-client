import { logger } from "logger";
import api from "api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { rangeToInfo, InfoToRange, eraseHighlight, drawHighlight } from "./util";
import { useRecoilState } from "recoil";
import {
	bookChangedState,
	roomUsersState,
	penModeState,
	userState,
	scrollerRefState,
	highlightState,
	buttonGroupsPosState,
	currentHighlightIdState,
} from "recoil/atom";
import socket from "socket.js";
import "./styles.css";

import HighlightList from "./HighlightList";

import OptionsModal from "components/OptionsModal";
function Highlighter({ bookId, renderContent }) {
	const { roomId } = useParams();
	const [user, setUser] = useRecoilState(userState);
	const [roomUsers, setRoomUsers] = useRecoilState(roomUsersState);
	const [prevRoomUsers, setPrevRoomUsers] = useState([]);
	const [color, setColor] = useState("yellow");
	const [optionsModalOpen, setOptionsModalOpen] = useState(false);
	const [highlightId, setHighlightId] = useState(null);
	const [highlightInfos, setHighlightInfos] = useState(null);

	const [highlightList, setHighlightList] = useRecoilState(highlightState);
	const [scrollerRef, setScrollerRef] = useRecoilState(scrollerRefState);
	const [penMode, setPenMode] = useRecoilState(penModeState);
	const [bookChanged, setBookChanged] = useRecoilState(bookChangedState);
	const [buttonGroupsPos, setButtonGroupsPos] = useRecoilState(buttonGroupsPosState);
	const [currentHighlightId, setCurrentHighlightId] = useRecoilState(currentHighlightIdState);
	useEffect(() => {
		scrollerRef?.addEventListener("mouseup", selectionToHighlight);
		return () => {
			scrollerRef?.removeEventListener("mouseup", selectionToHighlight);
		};
	}, [scrollerRef, user, penMode]);

	useEffect(() => {
		setHighlightList([]);
	}, [bookId]);

	const selectionToHighlight = () => {
		if (!user) {
			alert("하이라이팅은 로그인이 필요합니다.");
			return;
		}
		const selectedRange = window.getSelection();

		if (penMode == "highlight" && selectedRange.rangeCount == 1 && !selectedRange.isCollapsed) {
			const range = selectedRange.getRangeAt(0);
			// console.log(range);
			const additionalInfo = { bookId: bookId, text: selectedRange.toString() };
			const highlightInfo = rangeToInfo(range, additionalInfo);
			// console.log("highlightInfo", highlightInfo);
			setOptionsModalOpen(true);
			setHighlightInfos([highlightInfo]);
		}

		selectedRange.removeAllRanges();
	};

	useEffect(() => {
		if (renderContent) {
			const pageNum = 1; //pageNum은 레이지로드 전까지는 1로 해도 전체 가져옴
			if (user) {
				console.log("my applyServerHighlight");
				applyServerHighlight(user.id, bookId, pageNum, color, true);
			} else {
				console.log("로그아웃, 하이라이트 지움");
				setHighlightList([]);
				scrollerRef.querySelectorAll("mark").forEach((highlight) => {
					const highlightId = highlight.getAttribute("data-highlight-id");
					eraseHighlight(scrollerRef, highlightId);
				});
			}
		}
	}, [renderContent, user, bookChanged]);

	useEffect(() => {
		console.log("prevUsers", prevRoomUsers, "roomUsers", roomUsers);
		const leftUsers = prevRoomUsers.filter((prevUser) => !roomUsers.some((user) => user.id === prevUser.id));
		const joinedUsers = roomUsers.filter((user) => !prevRoomUsers.some((prevUser) => prevUser.id === user.id));
		setPrevRoomUsers(roomUsers);
		console.log("leftUsers", leftUsers, "joinedUsers", joinedUsers);
		if (!user) return;
		joinedUsers?.forEach((roomUser) => {
			const pageNum = 1; //레이지로드 전까지는 1로 해도 전체 가져옴
			if (roomUser.id !== user.id) {
				applyServerHighlight(roomUser.id, bookId, pageNum, "pink");
			}
		});
		leftUsers?.forEach((roomUser) => {
			console.log("left", roomUser.id);
			scrollerRef.querySelectorAll(`mark[data-user-id="${roomUser.id}"]`).forEach((highlight) => {
				const highlightId = highlight.getAttribute("data-highlight-id");
				eraseHighlight(scrollerRef, highlightId);
			});
		});
	}, [roomUsers, bookChanged]);

	useEffect(() => {
		socket.on("draw-highlight", (data) => {
			console.log("draw-highlight", data);
			const newRange = InfoToRange(data);
			const drawHighlightInfo = {
				...data,
				color: "pink",
			};
			// console.log(setButtonGroupsPos, "PDFVIEWER setButtonGroupsPos");

			drawHighlight(newRange, drawHighlightInfo, setButtonGroupsPos, scrollerRef, setCurrentHighlightId);
		});
		return () => {
			socket.off("draw-highlight");
		};
	}, [user, scrollerRef]);

	useEffect(() => {
		socket.on("erase-highlight", (data) => {
			console.log("erase-highlight", data);
			eraseHighlight(scrollerRef, data.id);
		});
		return () => {
			socket.off("erase-highlight");
		};
	}, [user, scrollerRef]);

	/* Server */
	const applyServerHighlight = (userId, bookId, pageNum, color, set = false) => {
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
						color: color || highlightInfo.color,
						bookId: bookId,
					};
					// console.log(setButtonGroupsPos, "PDFVIEWER setButtonGroupsPos2");
					drawHighlight(newRange, drawHighlightInfo, setButtonGroupsPos, scrollerRef, setCurrentHighlightId);
					if (set) {
						highlights.push(highlightInfo);
					}
				});
				if (set) {
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
				// 유저가 칠한 하이라이트에 아이디가 생성되는 부분 (서버에서 받아옴)
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

		eraseHighlight(scrollerRef, highlightInfo.id);
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
