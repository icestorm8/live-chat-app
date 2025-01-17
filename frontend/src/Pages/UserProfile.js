import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import Loading from "../Components/Loading";

export default function UserProfile() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [viewedUser, setViewedUser] = useState({});

  const getUserProfile = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken"); // You can also use sessionStorage if you want the token to last for the session only
    if (token) {
      try {
        // Send POST request to backend to create user
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Required to specify the type of data
            },
          }
        );
        // Success - save user and token
        const { user } = response.data; // Destructure the response to get token and user data
        console.log(user);
        setViewedUser(user);
        // Save JWT token to localStorage
      } catch (err) {
        // Handle error (e.g., user already exists)
        console.log(err.response?.data?.message || "Something went wrong");
      }
    } else {
      alert("unable to verify, please login");
      nav("/login");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      if (user._id === id) {
        nav("/profile");
      }
      getUserProfile();
    }
  }, [user, id]);

  const setAreFriends = async (areFriends) => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken"); // You can also use sessionStorage if you want the token to last for the session only
    if (token) {
      try {
        // Send POST request to backend to create user
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${id}/setFriendship`,
          { areFriends: areFriends },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Required to specify the type of data
            },
          }
        );

        // Success - save user and token
        const { user } = response.data; // Destructure the response to get token and user data
        setViewedUser(user);
        // Save JWT token to localStorage
      } catch (err) {
        // Handle error (e.g., user already exists)
        console.log(err.response?.data?.message || "Something went wrong");
      }
    } else {
      alert("unable to verify, please login");
      nav("/login");
    }
    setIsLoading(false);
  };
  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <div style={styles.profileContainer}>
          <h2>User Profile</h2>
          <div style={styles.userInfo}>
            <p>
              <strong>Username:</strong> {viewedUser?.username}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewedUser?.isConnected ? "Online" : "Offline"}
            </p>
            <p>{viewedUser?.areFriends ? "friends" : "not friends"}</p>
          </div>
          <button
            style={
              viewedUser?.areFriends ? styles.removeButton : styles.addButton
            }
            onClick={() => setAreFriends(!viewedUser?.areFriends)}
          >
            {viewedUser?.areFriends ? "Remove" : "Add"} Friend
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  profileContainer: {
    border: "1px solid #ccc",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "300px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  userInfo: {
    marginBottom: "20px",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  removeButton: {
    padding: "10px 15px",
    backgroundColor: "	#D22B2B",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
