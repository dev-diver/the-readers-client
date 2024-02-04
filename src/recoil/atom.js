import { atom } from "recoil";

export const userState = atom({
	key: "user",
	default: null,
});

export const drawerFormState = atom({
	key: "drawerForm",
	default: "none",
});

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

export const cursorCanvasRefsState = atom({
	key: "canvasRefsState",
	default: [],
});

export const bookChangedState = atom({
	key: "bookChanged",
	default: false,
});
