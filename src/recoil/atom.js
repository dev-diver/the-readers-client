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

export const bookChangedState = atom({
	key: "bookChanged",
	default: false,
});

/* pen mode */
export const penModeState = atom({
	key: "penMode",
	default: "highlight",
});

/* domRef */
//커서
export const cursorCanvasRefsState = atom({
	key: "canvasRefsState",
	default: [],
});

export const scrollerRefState = atom({
	key: "scrollerRefState",
	default: null,
});

export const eachPageLoadingState = atom({
	key: "eachPageLoading",
	default: [],
});

export const isVideoExitState = atom({
	key: "isVideoExit",
	default: false,
});
