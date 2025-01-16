import React, { useState } from "react";

const MessageForm = ({ onSend }) => {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() !== "") {
      onSend(messageText);
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
