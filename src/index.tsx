import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./components/App";
import { ReduxWrapper } from "./components/ReduxWrapper";

ReactDOM.render(
  <React.StrictMode>
    <ReduxWrapper>
      <App />
    </ReduxWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
