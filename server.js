import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.get("/", (req, res) => res.send("WebSocket TTS server running"));
const server = app.listen(8080, () => console.log("Server running on port 8080"));

const wss = new WebSocketServer({ server });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
}

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send(JSON.stringify({
    username: "Tester",
    amount: 50,
    message: "Hello from Koyeb!",
    gif: "https://i.imgur.com/2uZJt3P.gif"
  }));
});

// Optional: send a message every 30 seconds for testing
setInterval(() => {
  broadcast({
    username: "AutoTest",
    amount: Math.floor(Math.random() * 100),
    message: "This is a test message!",
    gif: "https://i.imgur.com/2uZJt3P.gif"
  });
}, 30000);
