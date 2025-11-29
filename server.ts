// Deno Deploy compatible WebSocket TTS server
// NO Express, NO "ws", no installs needed

Deno.serve((req) => {
  // Root URL (GET /)
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("WebSocket TTS server running", {
      headers: { "content-type": "text/plain" }
    });
  }

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
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

  return response;
});

// Broadcast storage
const clients = new Set<WebSocket>();

// Global listener for connections
Deno.serve({
  onListen() {
    console.log("Server running on Deno Deploy");
  },
  handler(req) {
    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("WebSocket TTS server running");
    }

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

    socket.onclose = () => {
      clients.delete(socket);
    };

    return response;
  },
});

// Broadcast function
function broadcast(data: any) {
  for (const client of clients) {
    try {
      client.send(JSON.stringify(data));
    } catch (_) {}
  }
}

// Auto broadcast every 30 seconds (same as your original)
setInterval(() => {
  broadcast({
    username: "AutoTest",
    amount: Math.floor(Math.random() * 100),
    message: "This is a test message!",
    gif: "https://i.imgur.com/2uZJt3P.gif"
  });
}, 30000);
