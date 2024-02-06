import { useSetRecoilState, useRecoilCallback } from "recoil";
import { drawerFormState, cursorCanvasRefsState } from "./atom";

// 커스텀 훅 사용
export function useToggleDrawer() {
	const setDrawerOpen = useSetRecoilState(drawerFormState);
	return (state) => (event) => {
		if (event?.type === "keydown" && (event?.key === "Tab" || event?.key === "Shift")) {
			return;
		}
		setDrawerOpen(state);
	};
}
