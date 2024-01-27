import React, { useState, useEffect } from "react";
import Book from "components/Book";
import Page from "components/Page";

import SearchChange from "components/SearchChange";
import { SearchBox } from "components/SearchBox";
import Hambugerbutton from "icons/Hambergerbutton";
// import "./style.css";

function Main() {
  const [data, setData] = useState([]);
  const [studyroomList, setStudyroomList] = useState([]);

  useEffect(() => {
    console.log("data changed");
    const newData = data.map((e, i) => {
      return <Book name={e.name} id={e.id}></Book>;
    });
    setStudyroomList(newData);
  }, [data]);


  return (
    <div className="mainpage-book">
      <SearchChange setData={setData} />
      <div className="search-result">
        <div className="div">{studyroomList}</div>
      </div>
      <div className="overlap-wrapper">
        <div className="overlap">
          <Page className="design-component-instance-node-2" />
          <Hambugerbutton className="hambuger-button" />
          <div className="search-result">
            <div className="div">
              <Book className="design-component-instance-node-2" />
              <Book className="book-instance" />
              <Book className="book-2" />
              <Book className="book-3" />
              <Book className="book-4" />
            </div>
          </div>
          <SearchBox
            className="search-box-instance"
            hasVector={false}
            searchUnion="https://c.animaapp.com/yGFj865V/img/union-1.svg"
          />
        </div>
      </div>
    </div>
  );
}

export default Main;