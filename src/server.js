// importing required modules
const express = require('express');
const path = require('path');
require('dotenv').config();

// creating an express app, then an http server, which is then passed to socketio
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);

// This will contain all the users
const users = [];

// Setting up of port 
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

/////////////////////// IMPLEMENT BELOW STEPS //////////////////////

// Setup io to listen to new connection and then inside its callback implement

  // Send {username:"Bot", message:"Welcome to chatbox"} about "message" to current socket only

  // Listen for "userJoin" from client to get new username, add him to users array as {id: socket.id, username: username},
  // send {username:"Bot",message:`${username} has joined the chat`} about "message" to everyone except current socket and
  // send updated users array about "updateUsers" to every socket

  // Listen for "disconnect", find the username from users array matching socket.id and 
  // send {username:"Bot",message:`${username} has left the chat`} about "message" to everyone except current socket
  // also remove the user from users array send updated users array about "updateUsers" to every socket

  // Listen for "chatMessage" for any message and send {username:msg.username,message:msg.message} about "message" to every socket

// Setting up io to listen to new connections
io.on("connection", (socket) => {
  console.log('A user connected');

  // Send a welcome message from the Bot to the current user
  socket.emit("message", { username: "Bot", message: "Welcome to chatbox" });

  // Listen for "userJoin" event
  socket.on("userJoin", (username) => {
      users.push({ id: socket.id, username });
      
      // Notify others that a new user has joined
      socket.broadcast.emit("message", { username: "Bot", message: `${username} has joined the chat` });
      
      // Update the users list for all clients
      io.emit("updateUsers", users);
  });

  // Listen for "chatMessage" and broadcast the message
  socket.on("chatMessage", (msg) => {
      io.emit("message", { username: msg.username, message: msg.message });
  });

  // Handle "disconnect" event
  socket.on("disconnect", () => {
      const user = users.find(u => u.id === socket.id);
      if (user) {
          // Notify others that the user has left
          socket.broadcast.emit("message", { username: "Bot", message: `${user.username} has left the chat` });
          
          // Remove the user from the users array
          const index = users.indexOf(user);
          if (index !== -1) {
              users.splice(index, 1);
          }

          // Update the users list for all clients
          io.emit("updateUsers", users);
      }
  });
});

let server = http.listen(port, () => console.log(`Server Running at port ${port}`));

if (process.env.NODE_ENV === 'testing') {
  console.log('will kill the server after 30sec')
  setTimeout(() => {
    server.close()
  }, 60000);

}

exports.server = server
