import { useState } from "react";
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { TfiEmail, TfiLock } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/config";

function SignUpComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("email")) {
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
      <h1>Sign Up</h1>
      <form className="login__form" onSubmit={handleSignUp}>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(""); 
              }}
            />
            {showPassword ? (
              <PiEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className="input__icon right"
              />
            ) : (
              <PiEyeLight
                onClick={() => setShowPassword(!showPassword)}
                className="input__icon right"
              />
            )}
          </div>
        </div>

        <div className="form__group">
          <div className="group__header">
            <label htmlFor="confirmPassword" className="group__label">
              Confirm password
            </label>
            <span className="group__error">{confirmPasswordError}</span>
          </div>

          <div className="group-input__wrapper">
            <TfiLock className="input__icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="group__input"
              placeholder="Confirm password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(""); 
              }}
            />
            {showConfirmPassword ? (
              <PiEyeSlash
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="input__icon right"
              />
            ) : (
              <PiEyeLight
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="input__icon right"
              />
            )}
          </div>
        </div>

        <span className="sign-up__text">
          Already have an account? <Link to="/login">Sign In</Link>
        </span>

        <button type="submit" className="login__button" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </>
  );
}

export default SignUpComponent;
