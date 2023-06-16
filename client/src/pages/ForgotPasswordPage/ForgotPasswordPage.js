import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend with the email
      const response = await axios.post("/api/forgot-password", { email }); // Adjust the endpoint as per your backend setup

      // Assuming your backend sends a 'message' in the response
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || "Error sending reset link!");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="redirect-link">
        Remembered? <Link to="/login">Go back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
