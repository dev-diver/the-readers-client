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

export const useSetCanvasRef = (pageNum, bookChanged) => {
	// useRecoilCallback 훅을 사용하여 상태 업데이트 로직을 정의합니다.
	// 이번에는 pageNum을 커스텀 훅의 매개변수로 받습니다.
	const setRef = useRecoilCallback(
		({ set }) =>
			(el) => {
				// pageNum과 el을 사용하여 상태를 업데이트하는 로직을 정의합니다.
				set(cursorCanvasRefsState, (oldRefs) => {
					console.log("oldRefs", oldRefs);
					return oldRefs.map((ref) => {
						if (ref.page === pageNum) {
							// 주어진 pageNum에 해당하는 ref를 업데이트합니다.
							return { ...ref, ref: el };
						}
						return ref;
					});
				});
			},
		[pageNum, bookChanged]
	); // 커스텀 훅의 매개변수를 의존성 배열에 포함시킵니다.

	return setRef;
};
