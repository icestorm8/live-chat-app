import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // States to hold form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);
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
        `${process.env.REACT_APP_API_URL}/api/users/register`,
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
      alert("User created successfully! redirecting to home page");

      nav("/");

      // clear form
      setUsername("");
      setPassword("");
    } catch (err) {
      // Handle error (e.g., user already exists)
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
