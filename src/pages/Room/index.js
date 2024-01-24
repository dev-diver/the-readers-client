import React from "react"
import './styles.css';
import RtcViewer from './RtcViewer';
import PDFViewer from './PDFViewer';

function Room() {
  return (
    <div className="container">
      {/* <RtcViewer/> */}
      <PDFViewer/>
    </div>
  );
}

export default Room;
