import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hambugerbutton({className}) {
  const navigate = useNavigate();
  // 로그인 상태를 저장하는 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 프로필 창이 열렸는지를 저장하는 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // 로그인 창이 열렸는지를 저장하는 상태
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 햄버거 버튼 클릭 시 호출되는 함수
  const handleHamburgerClick = () => {
    console.log("Hamburger clicked!");
    // 로그인 상태에 따라 동작 분기
    if (isLoggedIn) {
      // 이미 로그인된 경우, 프로필 창 토글
      navigate("/profile");
      setIsProfileOpen((prevIsProfileOpen) => !prevIsProfileOpen);
    } else {
      // 로그인되지 않은 경우, 로그인 창 열기
      navigate("/login");
      setIsLoginOpen(true);
    }
  };

  return (
    <div>
      <button className={`hamburger-button ${className}`} onClick={handleHamburgerClick}>
        Hamburger Button
      </button>

      {/* 프로필 창 */}
      {isLoggedIn && isProfileOpen && (
        <div className="profile-container">
          {/* 프로필 내용 */}
          <p>Profile Content</p>
        </div>
      )}

      {/* 로그인 창 */}
      {!isLoggedIn && isLoginOpen && (
        <div className="login-container">
          <button onClick={ handleHamburgerClick }>Go to LoginPage</button>
          {/* 로그인 내용 */}
        </div>
      )}
    </div>
  );
};

export default Hambugerbutton;
