import { atom } from "recoil";

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

export const bookChangedState = atom({
	key: "bookChanged",
	default: false,
});

export const viewerScaleState = atom({
	key: "viewerScale",
	default: 1,
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

/* pen mode */
export const penModeState = atom({
	key: "penMode",
	default: "pointer",
});

/* domRef */
export const cursorCanvasRefsState = atom({
	key: "canvasRefsState",
	default: [],
});

export const scrollerRefState = atom({
	key: "scrollerRefState",
	default: null,
});
