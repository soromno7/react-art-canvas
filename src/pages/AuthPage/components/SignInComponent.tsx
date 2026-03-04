import { useState } from "react";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { TfiEmail, TfiLock } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/config";

function SignInComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.message.includes("Email") ||
          error.message.includes("Invalid login credentials")
        ) {
          setEmailError("Invalid email or password");
          setPasswordError("Invalid email or password");
        } else if (error.message.includes("email")) {
          setEmailError(error.message);
        } else if (error.message.includes("password")) {
          setPasswordError(error.message);
        } else {
          setEmailError(error.message);
        }
        return;
      }

      if (data.user) {
        navigate("/");
      }
    } catch (error: any) {
      setEmailError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Sign In</h1>
      <form className="login__form" onSubmit={handleSignIn}>
        <div className="form__group">
          <div className="group__header">
            <label htmlFor="email" className="group__label">
              Email
            </label>
            <span className="group__error">{emailError}</span>
          </div>

          <div className="group-input__wrapper">
            <TfiEmail className="input__icon" />
            <input
              type="email"
              id="email"
              className="group__input"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
          </div>
        </div>

        <div className="form__group">
          <div className="group__header">
            <label htmlFor="password" className="group__label">
              Password
            </label>
            <span className="group__error">{passwordError}</span>
          </div>

          <div className="group-input__wrapper">
            <TfiLock className="input__icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="group__input"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />

            {showPassword ? (
              <PiEyeSlash
                className="input__icon right"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <PiEyeLight
                onClick={() => setShowPassword(!showPassword)}
                className="input__icon right"
              />
            )}
          </div>
        </div>

        <span className="sign-up__text">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </span>

        <button type="submit" className="login__button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </>
  );
}

export default SignInComponent;
