import React from "react";
import { useParams, useEffect } from "react-router-dom";
import "./styles.css";
import RtcViewer from "./RtcViewer";
import PDFViewer from "./PDFViewer";

function Room() {
  const { id } = useParams();

  // useEffect(() => {}, []);

  return (
    <div className="container">
      {/* <RtcViewer/> */}
      <PDFViewer bookname={id} />
    </div>
  );
}

export default Room;
