import { createRoot } from "react-dom/client";
import { AuthProvider } from "./supabase/useAuth.tsx";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>,
);
