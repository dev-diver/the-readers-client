import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'api';
import { baseURL } from 'config/config';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const SignUpForm = () => {
  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const handleNickChange = (e) => {
    setNick(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    document.getElementById("signup-form").addEventListener("submit", handleSubmit);
    const errorParam = new URL(window.location.href).searchParams.get("error");
    if (errorParam) {
      alert("이미 존재하는 이메일입니다.");
    }
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make API request to register user
    api.post(`${baseURL}/auth/signup`, { nick: nick, email :email, password:password })
        .then((response) => {
            // Handle successful registration
            console.log(response.data);
        })
        .catch((error) => {
            // Handle error
            console.error(error);
        });
};

  return (
    <form id="signup-form" onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Nickname"
          value={nick}
          onChange={handleNickChange}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>

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
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
