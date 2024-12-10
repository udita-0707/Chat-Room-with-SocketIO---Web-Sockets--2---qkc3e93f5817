// Socket io on client side
const socket = io();

// Refer to chatbox.html & open it in browser to know what they represent
const usersList = document.querySelector(".users-name");
const chatForm = document.getElementById("message-form");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector(".messages");

// Getting username from index.html, here qs is a library to parse querystring in url 
const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true});

/////////////////////// IMPLEMENT BELOW STEPS //////////////////////

    // Send username about "userJoin" to server 

    // Listen for "updateUsers" from server and update usersList with new list of users, each user should be a li element containing username.

    // Listen for "message" from server and add new msg to messages, each message is a div element with class "message" 
    // containing 2 paragraphs, one with class "meta" containing username & other with class "text" containing message.

    // When a user submit a message in chatForm send {username: username, message: messageInput.value } about chatMessage to server 

// Send username to server for "userJoin" event
socket.emit("userJoin", username);

// Listen for "updateUsers" from the server
socket.on("updateUsers", (users) => {
    // Clear the current list
    usersList.innerHTML = "";

    // Update the user list with new users
    users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = user.username;
        usersList.appendChild(li);
    });
});

// Listen for "message" from the server
socket.on("message", (data) => {
    // Create a new message element
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    const meta = document.createElement("p");
    meta.classList.add("meta");
    meta.textContent = data.username;

    const text = document.createElement("p");
    text.classList.add("text");
    text.textContent = data.message;

    messageDiv.appendChild(meta);
    messageDiv.appendChild(text);

    // Add the message to the messages container
    messages.appendChild(messageDiv);

    // Scroll to the latest message
    messages.scrollTop = messages.scrollHeight;
});

// Handle form submission
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();

    if (message) {
        // Send the message to the server
        socket.emit("chatMessage", { username, message });

        // Clear the input field
        messageInput.value = "";
        messageInput.focus();
    }
});