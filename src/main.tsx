import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./locales";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <ToastContainer style={{ zIndex: 99999 }} />
  </React.StrictMode>,
);
