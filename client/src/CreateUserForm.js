import React, { useState } from "react";
import axios from "axios";

const CreateUserForm = () => {
  // States to hold form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });

      // Success - clear form and show success
      alert("User created successfully!");
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
};

export default CreateUserForm;
