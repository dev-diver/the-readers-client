import React, { useEffect, useRef } from "react";
import socket from "socket.js";
import "./style.css";

function CursorCanvas() {
  const canvas = useRef(null);
  const pointers = useRef([]);

  useEffect(() => {
    socket.on("updatepointer", (data) => {
      updatePointers(data); 
      redrawCanvas();
    });
  },[]);

  const updatePointers = (data) => {
    // 새로운 포인터 데이터 추가 또는 업데이트
    const index = pointers.current.findIndex(p => p.id === data.id);
    if (index >= 0) {
      pointers.current[index] = data;
    } else {
      pointers.current.push(data);
    }
  };

  const clearCanvas = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  };

  const redrawCanvas = () => {
    clearCanvas();
    pointers.current.forEach(p => {
      drawOnCanvas(p.x, p.y, p.color);
    });
  };

  function drawOnCanvas(x, y, color) {
    const ctx = canvas.current.getContext("2d");
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
