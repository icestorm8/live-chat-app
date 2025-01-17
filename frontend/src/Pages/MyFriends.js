import React, { useState, useEffect } from "react";
import FriendCard from "../Components/FriendCard"; // Import the FriendCard component
import "../Components/Friend.css";
import axios from "axios";

const MyFriends = () => {
  const [friends, setFriends] = useState([]);

  // Simulate fetching friends data (Replace this with your API call)
  useEffect(() => {
    // Example: Mocked friends data
    const getFriends = async () => {
      try {
        // Send GET request to backend to fetch friends data
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/friends`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Get token from localStorage
            },
          }
        );
        const { friends } = response.data; // Destructure the response to get friends data
        setFriends(friends); // Update state with friends data
      } catch (err) {
        // Handle error (e.g., user is not authorized, or server error)
        console.log(err.response?.data?.message || "Something went wrong");
      }
    };

    // Call the function to fetch friends on component mount
    getFriends();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="friends-container">
      <h2>My Friends</h2>
      <div className="friend-list">
        {friends.map((friend) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default MyFriends;
