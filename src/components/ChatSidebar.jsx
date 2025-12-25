import React from "react";

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: false },
];

const ChatSidebar = ({ setSelectedUser }) => {
  return (
    <div className="w-1/4 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-3 cursor-pointer rounded-lg mb-2 hover:bg-gray-700 ${
            user.active ? "bg-blue-600" : ""
          }`}
          onClick={() => setSelectedUser(user)}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
