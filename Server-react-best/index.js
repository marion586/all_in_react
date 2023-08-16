const express = require("express");
const app = express();
const port = 4000;
const http = require("http");
const cors = require("cors");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
require("dotenv").config();

console.log(process.env.HARPERDB_URL);
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

  //join_roomm ilnstenner
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

    harperGetMessages(room)
      .then((last100Messages) => {
        console.log("get message", last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room == room);
    console.log(chatRoomUsers);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    //// Get last 100 messages sent in the chat room
  });

  //Send message listner
  socket.on("send_message", (data) => {
    const { message, username, room, __createdtime__ } = data;
    
    io.in(room).emit("receive_message", data);
    harperSaveMessage(message, username, room, __createdtime__)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
