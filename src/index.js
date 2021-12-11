import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./components/Home/";
import Setup from "./components/Setup/";
import Devices from "./components/Devices";
import Animations from "./components/Animations";
import AnimationEditor from "./components/Animations/AnimationEditor";
import DragExample from "./components/DragExample";
import { AppProvider } from "./contexts/AppContext";
import reportWebVitals from "./reportWebVitals";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/animations" element={<Animations />} />
          <Route path="/animations/editor" element={<AnimationEditor />} />
          <Route path="/dragdropexample" element={<DragExample />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
