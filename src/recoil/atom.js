import { atom } from "recoil";

export const userState = atom({
	key: "user",
	default: null,
});

export const drawerFormState = atom({
	key: "drawerForm",
	default: "none",
});
