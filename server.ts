// FINAL WORKING DENO DEPLOY WEBSOCKET SERVER (FIXED)

const clients = new Set<WebSocket>();

Deno.serve((req: Request) => {
  const upgrade = req.headers.get("upgrade") || "";

  // HTTP request
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("WebSocket TTS server running!", {
      headers: { "content-type": "text/plain" }
    });
  }

  // WebSocket connection
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    clients.add(socket);
    console.log("Client connected");

    socket.send(JSON.stringify({
      username: "Tester",
      amount: 50,
      message: "Hello from Deno Deploy!",
      gif: "https://i.imgur.com/2uZJt3P.gif"
    }));
  };

  socket.onmessage = (event) => {
    console.log("Received:", event.data);
  };

  socket.onclose = () => {
    clients.delete(socket);
  };

  return response;
});

// Broadcast to all clients
function broadcast(data: any) {
  for (const client of clients) {
    try {
      client.send(JSON.stringify(data));
    } catch (_) {}
  }
}

// Auto broadcast every 30 seconds
setInterval(() => {
  broadcast({
    username: "AutoTest",
    amount: Math.floor(Math.random() * 100),
    message: "This is a test message!",
    gif: "https://i.imgur.com/2uZJt3P.gif"
  });
}, 30000);

console.log("Server running on Deno Deploy");
