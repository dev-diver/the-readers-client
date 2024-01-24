import React from "react";
import { Book } from "../../components/Book";
import { Page } from "../../components/Page";
import { SearchBox } from "../../components/SearchBox";
import { Hambugerbutton } from "../../icons/Hambergerbutton";
import "./style.css";

export const Main = () => {
  return (
    <div className="mainpage-book">
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
};
