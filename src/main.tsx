import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./supabase/useAuth.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
