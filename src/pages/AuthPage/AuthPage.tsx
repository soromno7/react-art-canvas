import "./auth.scss";
import "./authAnimation.scss";
import { useLocation } from "react-router-dom";
import SignInComponent from "./components/SignInComponent";
import SignUpComponent from "./components/SignUpComponent";

function AuthPage() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="login">
      <div className="login__wrapper">
        {isLoginPage ? <SignInComponent /> : <SignUpComponent />}
      </div>
    </div>
  );
}

export default AuthPage;
