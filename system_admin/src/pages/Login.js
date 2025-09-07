import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
  const [formdata, setformdata] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const onhandlechange = (e) => {
    const { name, value } = e.target;
    setformdata(data => ({
      ...data,
      [name]: value
    }));
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'systemAdmin') navigate('/dashboard');
        else if (userRole === 'normalUser') navigate('/normaluser_landing');
        else if (userRole === 'storeOwner') navigate('/storeowner_landing');
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formdata.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formdata.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formdata.password) {
      newErrors.password = "Password is required";
    } else if (formdata.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        alert(jsonResponse.msg || "An unexpected error occurred.");
        return;
      }

      if (jsonResponse.success) {
        localStorage.setItem('token', jsonResponse.token);
        const decodedToken = jwtDecode(jsonResponse.token);
        const userRole = decodedToken.role;

        if (userRole === 'systemAdmin') navigate('/dashboard');
        else if (userRole === 'normalUser') navigate('/normaluser_landing');
        else if (userRole === 'storeOwner') navigate('/storeowner_landing');
      } else {
        alert(jsonResponse.msg || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Could not connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div className="bg-white shadow-sm rounded-4 p-5" style={{ width: "100%", maxWidth: "700px" }}>
        <h3 className="fw-bold mb-4 text-center">Login</h3>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              value={formdata.email}
              onChange={onhandlechange}
            />
          </div>
          {errors.email && <small className="text-danger">{errors.email}</small>}

          
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-lock"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              name="password"
              value={formdata.password}
              onChange={onhandlechange}
            />
          </div>
          {errors.password && <small className="text-danger">{errors.password}</small>}

          
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="small text-decoration-none mt-2 mt-sm-0">
              Forgot Password?
            </a>
          </div>

          
          <button className="btn btn-primary w-100 mb-3" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 small text-muted">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <button className="btn btn-outline-secondary w-100 mb-3">Sign in with other</button>

        <p className="mt-3 text-center small">
          Don’t have an account?{" "}
          <a href="#" className="text-primary fw-bold">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
