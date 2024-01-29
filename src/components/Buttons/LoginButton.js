import React from 'react';


const LoginButton = ({ setPopState, isLogin ,setUser}) => {
    const handleLogin = () => {
        setPopState(true);
    };

    const handleLogout =() => {
        console.log('logout');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        isLogin ?
        <button onClick={handleLogout}>
            로그아웃
        </button>:
        <button onClick={handleLogin}>
            로그인
        </button>
        
    );
};

export default LoginButton;
