export const offerLogin = (user, pop) => {
	if (!user) {
		pop("signin");
		alert("로그인이 필요합니다.");
	}
};
