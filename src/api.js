import axios from "axios";
import { baseURL } from "config/config";

// 공통 설정을 가진 인스턴스 생성
const instance = axios.create({
	baseURL: `${baseURL}/api`,
});

instance.interceptors.response.use(
	function (response) {
		// 응답 데이터를 가공
		return response;
	},
	function (error) {
		if (error.response && error.response.status === 404) {
			// console.log("Not Found", error.message);
		} else {
			console.error("Error", error.message);
		}
		return Promise.reject(error);
	}
);

export default instance;
