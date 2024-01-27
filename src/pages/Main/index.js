import React, { useState, useEffect } from "react";
import Book from "components/Book";
import SearchChange from "components/SearchChange";
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
    </div>
  );
}

export default Main;
