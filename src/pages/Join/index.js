// import React from 'react'

// function Login() {
//   return (
//     <div>
//         <div>
//             <form action="">
//                 <div className='mb-3'>
//                     <label htmlFor="email">Email</label>
//                 </div>
//             </form>
//         </div>
//     </div>
//   )
// }

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import KakaoLogin from "../KakaoLogin";

function Join() {
  const history = useHistory();

  useEffect(function() {
    // URL에서 error 매개변수가 있는지 확인
    const errorParam = new URL(window.location.href).searchParams.get('error');

    // 만약 error 매개변수가 있다면 알림을 표시
    if (errorParam) {
      alert('이미 존재하는 이메일입니다.');
    }
  }, []);

function handleSubmit(event) {
    event.preventDefault();

    // 회원가입 로직 추가하기
    // history.push('/success') 또는 에러 발생 시 history.push('/error') 등을 사용할 수 있습니다.
  }

  return (
    <div className="timeline">
      <form id="join-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="join-email">이메일</label>
          <input id="join-email" type="email" name="email" />
        </div>
        <div className="input-group">
          <label htmlFor="join-nick">닉네임</label>
          <input id="join-nick" type="text" name="nick" />
        </div>
        <div className="input-group">
          <label htmlFor="join-password">비밀번호</label>
          <input id="join-password" type="password" name="password" />
        </div>
        <button id="join-btn" type="submit" className="btn">
          회원가입
        </button>
        <div>
          <KakaoLogin />
        </div>
      </form>
    </div>
  );
};

export default Join;

