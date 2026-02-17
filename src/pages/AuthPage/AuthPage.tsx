import "./auth.scss";
import "./authAnimation.scss";
import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { Context } from "../../main";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function LoginPage() {
  const firebaseContext = useContext(Context);

  const loginFunc = async () => {
    if (firebaseContext) {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(firebaseContext.auth, provider);
      console.log(user);
    }
  };
  return (
    <div className="login">
      <div className="login__wrapper">
        <h1>Enter using your Google account</h1>
        <div className="login__form">
          <button className="login__button" onClick={loginFunc}>
            <span>Sign in</span>
            <FcGoogle className="login__icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
