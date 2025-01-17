import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Message from "./Message";
import ReceiverInfoBar from "./ReceiverInfoBar";
import MessageForm from "./MessageForm";
import { UserContext } from "../../Context/UserContext";

const Conversation = ({ chatId }) => {
  const id = useParams().id || chatId;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatUser, setChatUser] = useState(null); // User you're chatting with
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log(id);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/messages/${id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const { messages } = response.data;
        console.log(response.data);
        setMessages(messages); // Store the messages in state
      } catch (err) {
        setError("Error fetching messages.");
      }
    };
    const fetchOtherUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chats/${id}/other-user`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const { otherUser } = response.data;
        console.log("response   mf: " + response.data);
        setChatUser(otherUser);
      } catch (err) {
        setError("Error fetching messages.");
      }
    };
    const fetchall = async () => {
      setLoading(true);
      await fetchMessages();
      await fetchOtherUserDetails();
      setLoading(false);
    };
    if (id && user) {
      fetchall();
    }
  }, [id, user, chatId]);

  const handleSendMessage = async (messageText) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        {
          // chatId,
          text: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setMessages([...messages, response.data]); // Append new message to messages list
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat">
      {loading && <p>Loading chat...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ReceiverInfoBar user={chatUser} />
      <div className="messages">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        {messages.length === 0 && (
          <p>no messages in conversation yet... be the first one to start</p>
        )}
      </div>
      <MessageForm onSend={handleSendMessage} chatId={chatId} />
    </div>
  );
};

export default Conversation;
