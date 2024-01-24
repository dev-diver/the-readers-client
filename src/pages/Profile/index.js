import React from "react";
import { Close1 } from "../../icons/Close1";
import "./style.css";

const Profilepage = () => {
  return (
    <div className="profilepage">
      <div className="div">
        <div className="overlap">
          <div className="text-wrapper">badge 3</div>
        </div>
        <div className="overlap-group">
          <div className="rectangle" />
          <Close1 className="close" />
          <div className="dengsmas-on-ig" />
          <div className="rectangle-2" />
          <div className="text-wrapper-2">edit</div>
          <div className="ellipse" />
        </div>
        <div className="div-wrapper">
          <div className="text-wrapper-3">following</div>
        </div>
        <div className="overlap-2">
          <div className="text-wrapper-4">follower</div>
        </div>
        <div className="overlap-group-2">
          <div className="rectangle-3" />
          <div className="rectangle-3" />
          <div className="text-wrapper-5">내 서재</div>
        </div>
        <div className="overlap-3">
          <img className="marker-pen" alt="Marker pen" src="https://c.animaapp.com/U5MPyiHk/img/marker-pen@2x.png" />
          <div className="overlap-4">
            <div className="rectangle-4" />
            <div className="rectangle-5" />
            <div className="text-wrapper-6">상태 메세지</div>
          </div>
        </div>
        <img className="img" alt="Rectangle" src="https://c.animaapp.com/U5MPyiHk/img/rectangle-9@2x.png" />
        <div className="overlap-5">
          <img className="rectangle-6" alt="Rectangle" src="https://c.animaapp.com/U5MPyiHk/img/rectangle-205.svg" />
          <div className="text-wrapper-7">최근에 읽은 책</div>
        </div>
        <div className="overlap-6">
          <div className="text-wrapper-8">badge 1</div>
        </div>
        <div className="overlap-7">
          <div className="text-wrapper-9">badge 2</div>
        </div>
        <div className="overlap-8">
          <div className="text-wrapper-10">setting</div>
        </div>
        <div className="overlap-9">
          <div className="text-wrapper-11">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
