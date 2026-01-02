import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import IceApp from "./IceApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IceApp />
  </StrictMode>,
);
