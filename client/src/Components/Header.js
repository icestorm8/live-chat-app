import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export default function Header() {
  const { user } = useUser();
  return (
    <header style={{ background: "#333", padding: "1rem", color: "#fff" }}>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ display: "inline", margin: "0 10px" }}>
            <Link to="/" style={{ color: "#fff" }}>
              Home
            </Link>
          </li>
          {user && (
            <li style={{ display: "inline", margin: "0 10px" }}>
              <Link to="/profile" style={{ color: "#fff" }}>
                Profile
              </Link>
            </li>
          )}
          {!user && (
            <li style={{ display: "inline", margin: "0 10px" }}>
              <Link to="/login" style={{ color: "#fff" }}>
                Login
              </Link>
            </li>
          )}
          {!user && (
            <li style={{ display: "inline", margin: "0 10px" }}>
              <Link to="/register" style={{ color: "#fff" }}>
                Register
              </Link>
            </li>
          )}
          {user && (
            <li style={{ display: "inline", margin: "0 10px" }}>
              <button
                style={{ color: "#fff" }}
                // onClick={() => signout()}
              >
                Signout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
