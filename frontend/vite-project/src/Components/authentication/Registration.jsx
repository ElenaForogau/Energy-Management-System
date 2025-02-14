import React, { useState } from "react";
import "./Login.css";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/ApiFunctions";

const Registration = () => {
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(registration);
      setSuccessMessage(result);
      setErrorMessage("");
      setRegistration({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(`Registration error: ${error.message}`);
    }
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);
  };

  const loginLink = () => {
    navigate("/login");
  };

  return (
    <div className="login-wrapper">
      <div className="wrapper">
        <div className="form-box register">
          <form onSubmit={handleRegistration}>
            <h1>Registration</h1>

            {errorMessage && (
              <p className="alert alert-danger">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="alert alert-success">{successMessage}</p>
            )}

            <div className="input-box">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={registration.firstName}
                onChange={handleInputChange}
                required
              />
              <FaUserAlt className="icon" />
            </div>
            <div className="input-box">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={registration.lastName}
                onChange={handleInputChange}
                required
              />
              <FaUserAlt className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registration.email}
                onChange={handleInputChange}
                required
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registration.password}
                onChange={handleInputChange}
                required
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> I agree to the terms & conditions
              </label>
            </div>
            <button type="submit">Register</button>
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={loginLink}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
