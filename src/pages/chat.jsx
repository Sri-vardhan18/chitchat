import React from 'react'
import ChatSidebar from '../components/ChatSidebar'
import ChatWindow from '../components/chatWindow'
import { useState } from 'react';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen w-full flex">
      <ChatSidebar setSelectedUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} />
    </div>
  );
};

export default Chat;