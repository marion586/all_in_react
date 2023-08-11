const express = require("express");
const app = express();
const port = 4000;
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");
const CHAT_BOT = "ChatBot";

let chatRoom = ""; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
app.use(cors()); // Add cors middleware
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    const { username, room } = data;
    console.log(username, room);
    socket.join(room);

    let __createdtime__ = Date.now();
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room == room);
    console.log(chatRoomUsers);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
