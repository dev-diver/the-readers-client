import axios from "axios";
import { baseURL } from "config/config";

// 공통 설정을 가진 인스턴스 생성
const instance = axios.create({
	baseURL: `${baseURL}/api`,
});

export default instance;
