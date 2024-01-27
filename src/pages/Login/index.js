import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar";

function Login(){

    // useEffect(function() {
    //     const errorParam = new URL(window.location.href).searchParams.get('error');
    //     alert(new URL(location.href).searchParams.get('error'));
    // }, []);

    return (
        <div>
            <Sidebar width={320}>
                <form id="login-form" action="/auth/login" method="post">
                    <div className="input-group">
                        <label for="email">이메일</label>
                        <input id="email" type="email" name="email" required autofocus />
                    </div>
                    <div className="input-group">
                        <label for="password">비밀번호</label>
                        <input id="password" type="password" name="password" required />
                    </ div>
                    <a id="join" href="/signup" className="btn">회원가입</a>
                    <br />
                    <button id="login" type="submit" className="btn">로그인</button>
                    <br />
                    <a id="kakao" href="/auth/kakao" className="btn">카카오톡</a>
                </form>
            </Sidebar>
        </ div>
    )
}

export default Login;