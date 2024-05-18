const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const chatHistory = {};
const activeRooms = new Set();
const activeUsers = new Set();

app.use(cors({
  origin: 'http://localhost:3001',
}));

const PORT = process.env.PORT || 3000;

const emitRoomList = () => {
  const rooms = Array.from(activeRooms);
  console.log('Current room list:', rooms);
  io.emit('room_list', rooms); // Broadcast to all connected clients
};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.emit('room_list', Array.from(activeRooms)); // Emit room list to new client
  console.log('Emitting room list to newly connected client');

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    activeUsers.delete(socket.username);
    // Remove user from all rooms they were part of
    socket.rooms.forEach((room) => {
      socket.leave(room);
      // Update room list if the room becomes empty
      if (io.sockets.adapter.rooms.get(room)?.size === 0) {
        activeRooms.delete(room);
        emitRoomList(); // Broadcast updated room list
      }
    });
  });

  socket.on('join_room', (room) => {
    socket.join(room);
    activeRooms.add(room); // Add room to active rooms
    emitRoomList(); // Broadcast updated room list
    console.log(`User joined room: ${room}`);

    // Send the chat history of the room if it exists
    if (chatHistory[room]) {
      socket.emit('load_history', chatHistory[room]);
    }
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
    // Check if the room still has users
    if (io.sockets.adapter.rooms.get(room)?.size === 0) {
      activeRooms.delete(room); // Remove the room if empty
      emitRoomList(); // Broadcast updated room list
    }
  });

  socket.on('message', (data) => {
    const messageData = {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString(), // Optionally store timestamp
    };
    console.log('Emitting message data:', messageData);

    // Store the message in chatHistory under the room key
    if (!chatHistory[data.room]) {
      chatHistory[data.room] = [];
    }
    chatHistory[data.room].push(messageData);

    // Emit message to all clients in the room
    io.to(data.room).emit('message', messageData);
  });

  socket.on('set_username', (username) => {
    if (activeUsers.has(username)) {
      socket.emit('username_taken', 'Username is already taken');
    } else {
      activeUsers.add(username);
      socket.username = username;
      socket.emit('username_set', username);
      console.log(`Username set to ${username}`);
    }
  });

  socket.on('get_room_list', () => {
    socket.emit('room_list', Array.from(activeRooms));
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  emitRoomList(); // Emit room list when server starts
});
