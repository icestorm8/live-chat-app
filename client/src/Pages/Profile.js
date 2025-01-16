import axios from "axios";
import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

// Sample user data
const defaultProfileImage = "https://www.w3schools.com/w3images/avatar2.png"; // Default profile image URL

const Profile = () => {
  const { user } = useUser();

  const nav = useNavigate();

  // useEffect(() => {
  //   getMyProfile();
  //   // Simulate fetching user data from API
  //   // For example: fetchUserProfileData().then(data => setUser(data));
  // }, []);

  // const getMyProfile = async () => {
  //   setIsLoading(true);
  //   const token = localStorage.getItem("authToken"); // You can also use sessionStorage if you want the token to last for the session only
  //   if (token) {
  //     try {
  //       // Send POST request to backend to create user
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/users/me`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`, // Required to specify the type of data
  //           },
  //         }
  //       );

  //       // Success - save user and token
  //       const { user } = response.data; // Destructure the response to get token and user data
  //       setUser(user);
  //       // Save JWT token to localStorage
  //     } catch (err) {
  //       // Handle error (e.g., user already exists)
  //       console.log(err.response?.data?.message || "Something went wrong");
  //     }
  //   } else {
  //     alert("unable to verify, please login");
  //     nav("/login");
  //   }
  //   setIsLoading(false);
  // };

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
