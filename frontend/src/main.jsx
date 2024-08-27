import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/color.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./Contexts/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
