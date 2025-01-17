import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MessageForm = ({ onSend, chatId }) => {
  const id = useParams().id || chatId;
  useEffect(() => {
    console.log("CHATID" + id);
  }, [chatId, id]);

  const [messageText, setMessageText] = useState("");
  const sendMessage = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/send-message`,
        {
          conversationId: id,
          content: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log("Message sent successfully", response.data);
    } catch (error) {
      console.error("Error sending message", error.response?.data);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (messageText.trim() !== "" && id) {
      // onSend(messageText);
      await sendMessage();
      setMessageText("");
    }
  };

  return (
    <div className="message-input-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageForm;
