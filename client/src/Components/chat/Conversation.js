import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import ReceiverInfoBar from "./ReceiverInfoBar";
import MessageForm from "./MessageForm";

const Conversation = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatUser, setChatUser] = useState(null); // User you're chatting with

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/chats/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setMessages(response.data.messages);
        setChatUser(response.data.chatUser); // Assuming backend returns the other user profile info
      } catch (err) {
        setError("Error fetching messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages(); // Fetch messages on component mount
  }, [chatId]);

  const handleSendMessage = async (messageText) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        {
          chatId,
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
      </div>
      <MessageForm onSend={handleSendMessage} />
    </div>
  );
};

export default Conversation;
