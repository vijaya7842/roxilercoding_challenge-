
import React, { useState } from "react";
import { useNavigate,Link } from 'react-router-dom';

const Signup = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normalUser",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const onhandlechange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formdata.name) newErrors.name = "Name is required";
    if (!formdata.email) newErrors.email = "Email is required";
    if (!formdata.password) newErrors.password = "Password is required";
    if (!formdata.address) newErrors.address = "Address is required";
    if (!formdata.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    const Response=await fetch("http://localhost:5000/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formdata)
    })
    const json = await Response.json();
    if(json.success){
      navigate('/normaluser_landing');
      localStorage.setItem('token',json.token)
    }else{
      alert(json.msg)
    }

    
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div
        className="bg-white shadow-sm rounded-4 p-5"
        style={{ width: "100%", maxWidth: "700px" }}
      >
        <h3 className="fw-bold mb-4 text-center">Sign Up</h3>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              name="name"
              value={formdata.name}
              onChange={onhandlechange}
            />
          </div>
          {errors.name && <small className="text-danger">{errors.name}</small>}

          
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-envelope"></i>
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

         
          <div className="mb-3 input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-geo-alt"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              name="address"
              value={formdata.address}
              onChange={onhandlechange}
            />
          </div>
          {errors.address && <small className="text-danger">{errors.address}</small>}

          
         
          <button
            className="btn btn-primary w-100 mb-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-3 text-center small">
          Already have an account?{" "}
         <Link to="/" className="text-primary fw-bold">
    Login
  </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;