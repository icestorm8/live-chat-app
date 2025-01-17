import React, { useContext, useState } from "react";
import MyChats from "../Components/chat/MyChats";
import Conversation from "../Components/chat/Conversation";
import { UserContext } from "../Context/UserContext";

export default function Home() {
  const [chatId, setChatId] = useState(-1);
  const { user } = useContext(UserContext);
  return (
    <div>
      {user && (
        <div>
          <MyChats chatId={chatId} setChatId={setChatId} />
          {chatId !== -1 && <Conversation chatId={chatId} />}
        </div>
      )}
      {!user && <div>hello! please login to chat!</div>}
    </div>
  );
}
