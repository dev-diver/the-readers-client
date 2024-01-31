import React, { useState } from "react";
import api from "api";
import { baseURL } from "config/config";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const LogInForm = ({ setUser, isLogin, setPopState }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [showSignUpForm, setShowSignUpForm] = useState(false);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		api
			.post(`${baseURL}/auth/login`, { email: email, password: password })
			.then((response) => {
				localStorage.setItem("user", JSON.stringify(response.data.user));
				setUser(response.data.user);
				setPopState("none");
				setErrorMessage("");
			})
			.catch(() => {
				setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
			});
	};

	return isLogin ? null : (
		<form onSubmit={handleSubmit}>
			{!showSignUpForm && (
				<div>
					<InputGroup className="mb-3">
						<Form.Control
							type="email"
							placeholder="Email"
							value={email}
							onChange={handleEmailChange}
							aria-label="Default"
							aria-describedby="inputGroup-sizing-default"
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<Form.Control
							type="password"
							placeholder="Password"
							value={password}
							onChange={handlePasswordChange}
							aria-label="Default"
							aria-describedby="inputGroup-sizing-default"
						/>
					</InputGroup>
					<Button onClick={() => setPopState("signup")}>가입하기</Button>
					<Button type="submit">로그인</Button>
				</div>
			)}
			<br />
			{errorMessage && <p>{errorMessage}</p>}
		</form>
	);
};

export default LogInForm;
