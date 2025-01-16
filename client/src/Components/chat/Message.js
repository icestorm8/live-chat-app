import React from "react";

const Message = ({ message }) => {
  return (
    <div className={`message ${message.sender === "me" ? "sent" : "received"}`}>
      <p>{message.text}</p>
      <small>{new Date(message.createdAt).toLocaleString()}</small>
    </div>
  );
};

export default Message;
