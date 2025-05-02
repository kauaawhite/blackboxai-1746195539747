import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('users', (users) => {
      setUsers(users.filter((user) => user !== username));
    });

    socket.on('private_message', ({ from, message, timestamp }) => {
      setMessages((prev) => [...prev, { from, message, timestamp }]);
    });

    return () => {
      socket.off('users');
      socket.off('private_message');
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('register', username);
      setLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() && selectedUser) {
      socket.emit('private_message', { to: selectedUser, message: inputMessage });
      setMessages((prev) => [...prev, { from: username, message: inputMessage, timestamp: new Date().toISOString() }]);
      setInputMessage('');
    }
  };

  if (!loggedIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-grow">
        <div className="w-1/4 border-r p-4">
          <h2 className="font-bold mb-4">Users</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user}
                className={`cursor-pointer p-2 rounded ${selectedUser === user ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <div className="flex-grow overflow-y-auto border rounded p-4 mb-4">
            {messages
              .filter((msg) => msg.from === selectedUser || msg.from === username)
              .map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded max-w-xs ${
                    msg.from === username ? 'bg-blue-600 text-white self-end' : 'bg-gray-300 self-start'
                  }`}
                >
                  <div className="text-xs text-gray-700">{msg.from}</div>
                  <div>{msg.message}</div>
                  <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow border rounded p-2 mr-2"
              placeholder="Type a message"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
