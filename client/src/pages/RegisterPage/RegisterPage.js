import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateUsername = (username) => {
    const regex = /\d.*\d/;
    return regex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 5) {
      setMessage("Password must be greater than 5 characters!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    if (!validateUsername(formData.username)) {
      setMessage("Username must contain at least 2 numbers!");
      return;
    }

    try {
      // console.log(formData);
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      if (response.data.message || response.status === 200) {
        // After successful registration, create a Result document
        // try {
        //   await axios.post("api/users/createResult", {
        //     username: formData.username,
        //   });
        // } catch (error) {
        //   console.error("Failed to create result document", error);
        // }

        alert("Registration Successful, Welcome Aboard");
        navigate("/login");
      } else {
        setMessage(response.data.msg || "Registration failed!");
      }
    } catch (error) {
      setMessage(error.response.data.msg || "Registration failed!");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="login-links">
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;

// ------------------------------------------------------------------------

// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import "./RegisterPage.css";

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateUsername = (username) => {
//     const regex = /\d.*\d/;
//     return regex.test(username);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password.length < 5) {
//       setMessage("Password must be greater than 5 characters!");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setMessage("Passwords don't match!");
//       return;
//     }

//     if (!validateUsername(formData.username)) {
//       setMessage("Username must contain at least 2 numbers!");
//       return;
//     }

//     try {
//       // console.log("formdata ", formData);
//       const response = await axios.post("api/users/register", formData);
//       if (response.data.message || response.status === 200) {
//         alert("Registration Successful, Welcome Aboard");
//         navigate("/login");
//       } else {
//         setMessage(response.data.msg || "Registration failed!");
//       }
//     } catch (error) {
//       setMessage(error.response.data.msg || "Registration failed!");
//     }
//   };

//   return (
//     <div className="register-container">
//       <h2>Register</h2>
//       {message && <p className="message">{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="input-group">
//           <label>Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label>Username</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">Register</button>
//       </form>
//       <div className="login-links">
//         <Link to="/login">Login</Link>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
