const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const typing = document.getElementById("typing");
const clearChat = document.getElementById("clearChat");

function addMessage(name, text, className) {
    const message = document.createElement("div");
    message.className = `message ${className}`;

    const messageName = document.createElement("div");
    messageName.className = "message-name";
    messageName.textContent = name;

    const messageText = document.createElement("div");
    messageText.textContent = text;

    message.append(messageName, messageText);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getLocalReply(message) {
    const text = message.toLowerCase();

    if (text.includes("hello") || text.includes("hi") || text.includes("హాయ్")) {
        return "Hello! I am Muni AI. How can I help you today?";
    }

    if (text.includes("what can you do") || text.includes("help")) {
        return "I can answer common questions, suggest ideas, and help you think through coding or project tasks. I work directly in this browser without an API key.";
    }

    if (text.includes("coding") || text.includes("code") || text.includes("website")) {
        return "For coding help, share the goal and the error or code you are working with. I can help break it into clear steps.";
    }

    if (text.includes("idea") || text.includes("ideas")) {
        return "Try building a personal dashboard, a portfolio chat assistant, or a small task planner with local browser storage.";
    }

    if (text.includes("thank")) {
        return "You are welcome! Ask me anything else when you are ready.";
    }

    return `I received: "${message}". I am a local browser assistant, so I can reply without an API key. Try asking about coding, ideas, or what I can do.`;
}

async function sendMessage(message) {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
        return;
    }

    const welcome = document.querySelector(".welcome");
    if (welcome) {
        welcome.remove();
    }

    addMessage("You", cleanMessage, "user-message");
    messageInput.value = "";
    messageInput.disabled = true;
    typing.classList.remove("hidden");

    await new Promise((resolve) => setTimeout(resolve, 450));
    addMessage("Muni AI", getLocalReply(cleanMessage), "ai-message");
    typing.classList.add("hidden");
    messageInput.disabled = false;
    messageInput.focus();
}

function sendSuggestion(message) {
    sendMessage(message);
}

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(messageInput.value);
});

clearChat.addEventListener("click", () => {
    chatMessages.innerHTML = `
        <div class="welcome">
            <div class="big-ai">🤖</div>
            <h1>Hi! I'm Muni AI 👋</h1>
            <p>Ask me anything. I'm here to help you.</p>
            <div class="suggestions">
                <button type="button" onclick="sendSuggestion('What can you do?')">💡 What can you do?</button>
                <button type="button" onclick="sendSuggestion('Help me with coding')">💻 Help me with coding</button>
                <button type="button" onclick="sendSuggestion('Give me some ideas')">🚀 Give me some ideas</button>
            </div>
        </div>`;
});