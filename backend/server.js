const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const pool = require("./db");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Muni Chat Backend is running 🚀");
});

// Get previous messages
app.get("/api/messages", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM messages ORDER BY created_at ASC"
        );

        res.json(rows);

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// Socket.IO connection
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Receive message
    socket.on("send_message", async (data) => {

        console.log("Message received:", data);

        try {

            const { username, message } = data;

            if (!username || !message) {
                console.log("Username or message missing");
                return;
            }

            // Save message to MySQL
            const [result] = await pool.query(
                "INSERT INTO messages (username, message) VALUES (?, ?)",
                [username, message]
            );

            const newMessage = {
                id: result.insertId,
                username: username,
                message: message,
                created_at: new Date()
            };

            console.log("Message saved:", newMessage);

            // Send message to all connected users
            io.emit("receive_message", newMessage);

        } catch (error) {

            console.error("Message error:", error);

        }
    });

    // User disconnect
    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

    });

});

// Start server
const PORT = 5000;

server.listen(PORT, () => {

    console.log(`Chat server running at http://localhost:${PORT}`);

});