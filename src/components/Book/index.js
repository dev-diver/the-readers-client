import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function Book({ name, id }) {
  return (
    <div>
      <Link to={`/room/${id}`}>{name}</Link>
    </div>
  );
}

export default Book;
