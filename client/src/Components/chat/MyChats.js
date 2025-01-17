import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // For making HTTP requests
import { UserContext, useUser } from "../../Context/UserContext";

const MyChats = ({ chatId, setChatId }) => {
  // State to hold the list of chats and any error message
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user} = useContext(UserContext);
  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Make a request to fetch the list of chats
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the auth token
            },
          }
        );
        setChats(response.data); // Set the list of chats
      } catch (err) {
        setError("Error fetching chats.");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      console.log(user);
    }
    fetchChats(); // Call the function to fetch chats
  }, []); // Empty dependency array, so this effect runs only once on mount

  return (
    <div className="my-chats">
      <h2>My Chats</h2>
      {loading && <p>Loading chats...</p>} {/* Show loading message */}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Show error message */}
      {chats.length === 0 && !loading && <p>You have no chats yet.</p>}{" "}
      {/* If no chats */}
      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={`chat-item ${chatId === chat._id ? "selected" : ""}`}
            onClick={() => setChatId(chat._id)}
          >
            <h3>{chat.name}</h3>
            <p>
              Last message:{" "}
              {chat.lastMessage ? chat.lastMessage.text : "No messages yet"}
            </p>
            <p>Participants: {chat.participants.join(", ")}</p>
            {/* You can add other chat info as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyChats;
