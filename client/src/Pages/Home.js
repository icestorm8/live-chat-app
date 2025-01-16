import React, { useState } from "react";
import MyChats from "../Components/chat/MyChats";
import Conversation from "../Components/chat/Conversation";

export default function Home() {
  const [chatId, setChatId] = useState(-1);
  return (
    <div>
      <MyChats chatId={chatId} setChatId={setChatId} />
      <Conversation chatId={chatId} />
    </div>
  );
}
