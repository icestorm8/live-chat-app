import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#333", padding: "1rem", color: "#fff" }}>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ display: "inline", margin: "0 10px" }}>
            <Link to="/" style={{ color: "#fff" }}>
              Home
            </Link>
          </li>
          <li style={{ display: "inline", margin: "0 10px" }}>
            <Link to="/profile" style={{ color: "#fff" }}>
              Profile
            </Link>
          </li>
          <li style={{ display: "inline", margin: "0 10px" }}>
            <Link to="/login" style={{ color: "#fff" }}>
              Login
            </Link>
          </li>
          <li style={{ display: "inline", margin: "0 10px" }}>
            <Link to="/register" style={{ color: "#fff" }}>
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
