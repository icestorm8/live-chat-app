import axios from "axios";
import React, { useState } from "react";

export default function Register() {
  // States to hold form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

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

      // Save JWT token to localStorage
      localStorage.setItem("authToken", token); // You can also use sessionStorage if you want the token to last for the session only

      setUserData(user);

      alert("User created successfully!");

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

      {userData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Welcome, {userData.username}!</h3>
          <p>isOnline: {userData.isOnline}</p>
          <p>last active: {userData.lastActive}</p>
          <p>updated at: {userData.updatedAt}</p>
          {/* You can display other user data as needed */}
        </div>
      )}
    </div>
  );
}
