// client/src/App.js

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:4000");
import { useState } from "react";
import Chat from "./pages/chat";

function App() {
  const [username, setUsername] = useState(""); // Add this
  const [room, setRoom] = useState("");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="chat"
            element={<Chat socket={socket} username={username} room={room} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
