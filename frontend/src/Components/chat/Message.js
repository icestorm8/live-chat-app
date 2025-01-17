import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import Loading from "../Loading";
const Message = ({ message }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user && message) {
      setLoading(false);
      console.log("user" + user._id);
      console.log(message);
    } else {
      setLoading(true);
    }
  }, [user, message]);
  console.log(user);
  return (
    <div>
      {loading && <Loading />}
      {!loading && (
        <div
          className={`message ${
            message.senderId._id === user._id ? "sent" : "received"
          }`}
        >
          <p>{message.content}</p>
          <small>{new Date(message.createdAt).toLocaleString()}</small>
        </div>
      )}
    </div>
  );
};

export default Message;
