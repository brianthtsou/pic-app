import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Assuming 'root' is the ID of your root div in your public/index.html
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
