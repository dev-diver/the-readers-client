import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


function Signup() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(function() {

    document.getElementById("signup-form").addEventListener("submit",handleSubmit);
    const errorParam = new URL(window.location.href).searchParams.get('error');
        if (errorParam) {
      alert('이미 존재하는 이메일입니다.');
    }
  }, [userInfo]);
  
  function handleSubmit(event) {
  event.preventDefault();
  navigate("/auth/signup", {replace: true});
  }


  return (
    <div className="timeline">
      <form id="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="signup-email">이메일</label>
          <input id="signup-email" type="email" name="email" />
        </div>
        <div className="input-group">
          <label htmlFor="signup-nick">닉네임</label>
          <input id="signup-nick" type="text" name="nick" />
        </div>
        <div className="input-group">
          <label htmlFor="signup-password">비밀번호</label>
          <input id="signup-password" type="password" name="password" />
        </div>
        <button id="signup-btn" type = "submit" method="post" className="btn">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;

