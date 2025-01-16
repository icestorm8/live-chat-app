import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  // States to hold form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { login } = useContext(UserContext); // Use the context
  const nav = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error state
    setError("");

    // Input validation (basic)
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Send POST request to backend to create user
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json", // Required to specify the type of data
          },
        }
      );

      // Success - save user and token
      const { token, user } = response.data; // Destructure the response to get token and user data
      login(token, user);
      alert(`hello ${user.username}`);
      nav("/");
      // clear form
      setUsername("");
      setPassword("");
      setError("");
    } catch (err) {
      // Handle error (e.g., user already exists)
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
