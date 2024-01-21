import React, { useEffect, useRef } from "react";
import socket from "../socket.js";
import "./style.css";

function CursorCanvas() {
  const canvas = useRef(null);

  useEffect(() => {
    socket.on("updatepointer", (data) => {
      const ctx = canvas.current.getContext("2d");
      drawOnCanvas(ctx, data.x, data.y, data.color); // 색상을 인자로 전달
    });
  });

  function drawOnCanvas(ctx, x, y, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
    ctx.fillStyle = color; // 서버로부터 받은 색상 사용
    ctx.font = "20px Arial";
    ctx.fillText("여기", x, y); // 텍스트 그리기
  }

  const canvasMouse = (event) => {
    const rect = canvas.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    socket.emit("movepointer", { x: x, y: y });
  };

  return <canvas ref={canvas} onMouseMove={canvasMouse} id="myCanvas" width="800" height="600"></canvas>;
}

export default CursorCanvas;
