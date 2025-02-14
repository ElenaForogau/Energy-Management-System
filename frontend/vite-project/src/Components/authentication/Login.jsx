import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { loginUser } from "../utils/ApiFunctions";
import "./Login.css";

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(login);

    if (response) {
      const { token, role, id } = response;
      auth.handleLogin(token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("userId", id);

      setSuccessMessage("Login successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        if (role === "ROLE_ADMIN") {
          navigate("/devices");
        } else {
          navigate("/user-dashboard");
        }
      }, 2000);
    } else {
      setErrorMessage("Invalid email or password. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  const registerLink = () => {
    navigate("/reg");
  };

  return (
    <div className="login-wrapper">
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {errorMessage && (
              <p className="alert alert-danger">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="alert alert-success">{successMessage}</p>
            )}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={login.email}
                onChange={handleInputChange}
                required
              />
              <FaUserAlt className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={login.password}
                onChange={handleInputChange}
                required
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={registerLink}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
