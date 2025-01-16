import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, useUser } from "../Context/UserContext";

export default function Header() {
  const { user } = useUser();
  const { logout } = useContext(UserContext); // Use the context

  const nav = useNavigate();
  const signout = () => {
    // Clear token from localStorage (sign out the user)
    alert(`bye ${user.username}`);
    logout();
    nav("/login");
  };
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
                style={{ color: "red" }}
                type="button"
                onClick={() => signout()}
              >
                Signout
              </button>
            </li>
          )}{" "}
          {user && (
            <li
              style={{
                display: "inline",
                margin: "0 10px",
                position: "relative",
                border: `2px solid ${user?.isOnline ? "green" : "red"}`,
                padding: "0.2em",
                paddingLeft: "1em",
                paddingRight: "1em",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  margin: "3px",
                  borderRadius: "50%",
                  width: "0.5em",
                  aspectRatio: "1/1",
                  backgroundColor: user?.isOnline ? "green" : "red",
                }}
              ></div>
              <span style={{ textAlign: "center" }}>
                {user?.isOnline ? "online" : "offline"}
              </span>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
