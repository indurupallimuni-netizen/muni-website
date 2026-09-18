// Connect to backend
const socket = io("http://localhost:5000");


// Elements
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
const messagesDiv = document.getElementById("messages");
const status = document.getElementById("status");
const emojiButton = document.getElementById("emoji-button");


// Connection
socket.on("connect", () => {

    status.textContent = "🟢 Online";

    console.log("Connected to server");

});


// Disconnection
socket.on("disconnect", () => {

    status.textContent = "🔴 Offline";

});


// Load previous messages
async function loadMessages() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/messages"
        );

        const messages = await response.json();

        messagesDiv.innerHTML = "";

        messages.forEach(message => {

            displayMessage(message);

        });

    } catch (error) {

        console.error(
            "Could not load messages:",
            error
        );

    }

}


// Display message
function displayMessage(data) {

    const messageElement =
        document.createElement("div");

    messageElement.className = "message";


    const time = new Date(data.created_at)
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    messageElement.innerHTML = `

        <strong>
            ${escapeHTML(data.username)}
        </strong>

        <div class="message-text">
            ${escapeHTML(data.message)}
        </div>

        <span class="message-time">
            ${time}
        </span>

    `;


    messagesDiv.appendChild(messageElement);


    // Scroll to bottom
    messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

}


// Send message
messageForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            usernameInput.value.trim();

        const message =
            messageInput.value.trim();


        if (!username) {

            alert("Please enter your name");

            usernameInput.focus();

            return;
        }


        if (!message) {

            return;
        }


        // Send to backend
        socket.emit(
            "send_message",
            {
                username: username,
                message: message
            }
        );


        // Clear input
        messageInput.value = "";

        messageInput.focus();

    }
);


// Receive message
socket.on(
    "receive_message",
    function (data) {

        displayMessage(data);

    }
);


// Emoji button
emojiButton.addEventListener(
    "click",
    function () {

        messageInput.value += " 😊";

        messageInput.focus();

    }
);


// Security
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Start
loadMessages();