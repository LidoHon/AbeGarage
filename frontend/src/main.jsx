import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/color.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./Contexts/AuthContext.jsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new QueryClient instance
// const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
    </AuthProvider>
  </StrictMode>
);
