import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

interface Message {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  isFiltered?: boolean;
}

const messages: Message[] = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.emit('messages', messages);

  socket.on('message', (data) => {
    const newMessage = {
      id: Date.now().toString(),
      content: data.content,
      author: data.author,
      timestamp: Date.now(),
      isFiltered: true // Messages that reach here have already been filtered
    };
    messages.push(newMessage);
    io.emit('messages', messages);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001; // Change this to match the client
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});