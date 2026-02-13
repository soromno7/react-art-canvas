import { TfiEmail } from "react-icons/tfi";
import { TfiLock } from "react-icons/tfi";
import { PiEyeLight } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";

import "./auth.scss";
import "./authAnimation.scss";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="login">
      <div className="login__wrapper">
        <h1>Login</h1>
        <form className="login__form">
          <div className="form__group">
            <label htmlFor="email" className="group__label">
              Email
            </label>
            <div className="group-input__wrapper">
              <TfiEmail className="input__icon" />
              <input
                type="email"
                id="email"
                name="email"
                className="group__input"
                placeholder="Email"
                required
                autoComplete="email"
              />
            </div>
            <span className="error__message" id="emailError"></span>
          </div>
          <div className="form__group">
            <div className="group__forgot-password">
              <label htmlFor="password" className="group__label">
                Password
              </label>
              <Link to="">Forgot password?</Link>
            </div>
            <div className="group-input__wrapper">
              <TfiLock className="input__icon" />
              <input
                type="password"
                id="password"
                name="password"
                className="group__input"
                placeholder="Password"
                required
                autoComplete="password"
              />
              <PiEyeLight className="input__icon right" />
              <PiEyeSlash className="input__icon right" />
            </div>
            <span className="error__message" id="passwordError"></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
