import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

// Sample user data
const defaultProfileImage = "https://www.w3schools.com/w3images/avatar2.png"; // Default profile image URL

const Profile = () => {
  const { user } = useContext(UserContext);

  const nav = useNavigate();

  return (
    <div>
      {!user && <Loading />}
      {user && (
        <div style={styles.profileContainer}>
          <img
            src={defaultProfileImage}
            alt="Profile"
            style={styles.profileImage}
          />
          <h2>{user?.username}</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.REACT_APP_DOMAIN}/users/${user?._id}`
              );
              alert("copied to clipboard");
            }}
          >
            copy link to profile
          </button>
          <p>
            <strong>Last Login:</strong> {user?.lastLogin}
          </p>
          <p>
            <strong>Last Update:</strong> {user?.lastUpdate}
          </p>
          <p>
            <strong>Status:</strong> {user?.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  profileContainer: {
    width: "300px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
};

export default Profile;
