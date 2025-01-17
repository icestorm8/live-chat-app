import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Friend.css";
import axios from "axios";

const FriendCard = ({ friend }) => {
  const nav = useNavigate();
  const createChat = async (recipientId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chats/create`,
        { recipientId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Send the token in the header
          },
        }
      );

      const { message, conversation } = response.data;
      console.log(message); // message details
      console.log(conversation); // Conversation details
      nav(`/chat/${conversation._id}`);

      // Optionally, update your state or navigate to the conversation screen
    } catch (err) {
      console.error(
        "Error creating conversation:",
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="friend-card">
      <Link to={`/users/${friend._id}`}>
        <div className="friend-info">
          <h3>{friend.username}</h3>
          <p>Status: {friend.isOnline ? "Online" : "Offline"}</p>
        </div>
      </Link>
      <div
        className={`status-indicator ${friend.isOnline ? "online" : "offline"}`}
      ></div>
      <button onClick={() => createChat(friend._id)} style={{ zIndex: 1000 }}>
        go to conversation
      </button>
    </div>
  );
};

export default FriendCard;
