import React, { useState, useEffect } from "react";
import Book from "components/Book";
import SearchChange from "components/SearchChange";
// import "./style.css";

let studyroomList = [];

function Main() {
  const [data, setData] = useState([]);

  useEffect(() => {
    studyroomList = data.map((e, i) => {
      return <Book key={`book-${i}`} name={e.name} id={e.id}></Book>;
    });
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
