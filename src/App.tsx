import "./reset.scss";
import LayoutPage from "./pages/LayoutPage/LayoutPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import PublicRoute from "./components/Routes/PublicRote";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PaintPage from "./pages/PaintPage/PaintPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <LayoutPage />
            </PrivateRoute>
          }
        >
          <Route index element={<MainPage />} />
          <Route path="paint" element={<PaintPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
