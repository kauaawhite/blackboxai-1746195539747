const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

const users = new Map(); // socketId -> username
const messages = []; // { from, to, message, timestamp }

// User registration/login (simple username)
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  // For simplicity, no password or persistence
  res.json({ success: true, username });
});

// Admin API to get users and messages
app.get('/admin/users', (req, res) => {
  res.json(Array.from(users.values()));
});

app.get('/admin/messages', (req, res) => {
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (username) => {
    users.set(socket.id, username);
    io.emit('users', Array.from(users.values()));
  });

  socket.on('private_message', ({ to, message }) => {
    const from = users.get(socket.id);
    const timestamp = new Date().toISOString();
    messages.push({ from, to, message, timestamp });

    // Send message to recipient if connected
    for (let [id, user] of users.entries()) {
      if (user === to) {
        io.to(id).emit('private_message', { from, message, timestamp });
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users', Array.from(users.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
