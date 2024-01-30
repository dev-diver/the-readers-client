import React from "react";

const ProfileButton = ({ setPopState, isLogin, setUser}) => { 
    const handleProfile = () => { 
        setPopState(true); 
    }; 
    return ( 
        <button onClick={handleProfile}> 
            프로필 보기 
        </button>
    )
}

export default ProfileButton;