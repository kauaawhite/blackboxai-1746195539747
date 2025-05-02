import React, { useState, useEffect } from 'react';

function AdminPanel({ socket }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('users', (users) => {
      setUsers(users);
    });

    // For demo, messages are not pushed from server, so we simulate fetching
    // In real app, implement API to fetch messages
    // Here we keep messages empty or you can extend backend to emit messages

    return () => {
      socket.off('users');
    };
  }, [socket]);

  const deleteMessage = (index) => {
    // For demo, just remove from local state
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Active Users</h3>
        <ul className="list-disc list-inside">
          {users.map((user) => (
            <li key={user}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Messages</h3>
        {messages.length === 0 ? (
          <p>No messages to display.</p>
        ) : (
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className="mb-2 border p-2 rounded">
                <div><strong>From:</strong> {msg.from}</div>
                <div><strong>To:</strong> {msg.to}</div>
                <div><strong>Message:</strong> {msg.message}</div>
                <button
                  onClick={() => deleteMessage(index)}
                  className="mt-2 bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
