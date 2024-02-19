import { atom, atomFamily } from "recoil";

export const roomState = atom({
	key: "room",
	default: { Books: [] },
});

export const htmlContentState = atom({
	key: "htmlContent",
	default: "",
});

/* sign in */
export const userState = atom({
	key: "user",
	default: null,
});

export const drawerFormState = atom({
	key: "drawerForm",
	default: "none",
});

/* socket 	*/
export const roomUserState = atom({
	key: "roomUser",
	default: null,
});

export const roomUsersState = atom({
	key: "roomUsers",
	default: [],
});

/* PDF viewer */

export const viewerScaleState = atom({
	key: "viewerScale",
	default: 1,
});

export const viewerScaleApplyState = atom({
	key: "viewerScaleApply",
	default: 1,
});

export const widthState = atom({
	key: "width",
	default: 0,
});

/* attenition feature */
export const isTrailState = atom({
	key: "isTrail",
	default: false,
});

export const isLeadState = atom({
	key: "isLead",
	default: false,
});

export const scrollYState = atom({
	key: "scrollY",
	default: 0,
});

/* highlight */
export const highlightState = atom({
	key: "highlight",
	default: [],
});

export const canvasElementsFamily = atomFamily({
	key: "canvasElementsFamily",
	default: [],
});

export const canvasHistoryFamily = atomFamily({
	key: "canvasHistoryFamily",
	default: [],
});

export const pageScrollTopFamily = atomFamily({
	key: "pageScrollTopFamily",
	default: -1,
});

export const pageLoadingStateFamily = atomFamily({
	key: "pageLoadingStateFamily",
	default: false,
});

export const totalPageState = atom({
	key: "totalPage",
	default: 0,
});

export const currentPageState = atom({
	key: "currentPage",
	default: 1,
});

export const bookChangedState = atom({
	key: "bookChanged",
	default: false,
});

export const renderContentState = atom({
	key: "renderContent",
	default: false,
});

/* pen mode */
export const penModeState = atom({
	key: "penMode",
	default: "highlight",
});

/* domRef */
//커서
export const cursorCanvasRefFamily = atomFamily({
	key: "cursorCanvasRefFamily",
	default: null,
});

export const scrollerRefState = atom({
	key: "scrollerRefState",
	default: null,
});

export const isVideoExitState = atom({
	key: "isVideoExit",
	default: false,
});

/* Appbar */
export const isAppBarPinnedState = atom({
	key: "isAppBarPinned",
	default: false,
});
