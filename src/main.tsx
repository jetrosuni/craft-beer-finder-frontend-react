import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./assets/index.css";
import "tw-elements/dist/css/tw-elements.min.css";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import "./assets/tailwind.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
