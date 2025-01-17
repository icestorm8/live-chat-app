import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // For making HTTP requests
import { UserContext, useUser } from "../../Context/UserContext";
import "./Chat.css";
const MyChats = ({ chatId, setChatId }) => {
  // State to hold the list of chats and any error message
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  // Fetch chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // console.log(`${process.env.REACT_APP_API_URL}/api/chats/`);
        // Make a request to fetch the list of chats
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the auth token
            },
          }
        );

        const { chats } = response.data;
        if (chats) {
          setChats(chats); // Set the list of chats
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Error fetching chats.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchChats(); // Call the function to fetch chats
    }
  }, [user, chatId]); // Empty dependency array, so this effect runs only once on mount

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
          <div
            key={chat._id}
            className={`chat-item ${chatId === chat._id ? "selected" : ""}`}
            style={{
              display: "inline-flex",
              width: "95%",
              flexDirection: "column",

              alignItems: "start",
              justifyContent: "center",
            }}
            onClick={() => setChatId(chat._id)}
          >
            {" "}
            <h3>{chat.otherUserName}</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1em",
                alignItems: "center",
              }}
            >
              {" "}
              <b>
                {chat.lastMessage.username === user.username
                  ? "you: "
                  : `${chat.lastMessage.username}: `}
              </b>
              <p>
                {chat.lastMessage
                  ? chat.lastMessage.content
                  : "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default MyChats;
