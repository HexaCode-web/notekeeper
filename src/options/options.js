import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./options.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const root = document.querySelector("#root");
ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>,
  root
);
