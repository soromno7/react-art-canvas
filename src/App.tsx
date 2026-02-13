import LayoutPage from "./pages/LayoutPage/LayoutPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./reset.scss";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/AuthPage/AuthPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<MainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
