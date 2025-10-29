/**
 * server.ts - Main Bun HTTP Server with WebSocket
 * Demonstrates: Bun.serve with HTTP routes and WebSocket support
 * 
 * This is the entry point of the application.
 * Run with: bun run src/server.ts
 */

import { AppDatabase } from "./db";
import { Auth } from "./auth";
import { FileManager } from "./files";
import { Utils } from "./utils";
import { Shell } from "./shell";
import { FFIExample } from "./ffi_example";

// Load environment variables
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || "core.db";
const SERVER_NAME = process.env.SERVER_NAME || "Bun Core Backend";

// Initialize database
const db = new AppDatabase(DB_NAME);

// WebSocket client tracking
const wsClients = new Set<any>();

/**
 * Main server using Bun.serve
 */
const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",

  /**
   * HTTP request handler
   */
  async fetch(req, server) {
    const url = new URL(req.url);
    const path = url.pathname;

    // WebSocket upgrade
    if (path === "/ws") {
      const upgraded = server.upgrade(req);
      if (upgraded) {
        return undefined; // Connection upgraded to WebSocket
      }
      return new Response("WebSocket upgrade failed", { status: 500 });
    }

    // Route: Home
    if (path === "/") {
      return new Response(
        `
<!DOCTYPE html>
<html>
<head>
  <title>${SERVER_NAME}</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #f472b6; }
    .endpoint { background: #f3f4f6; padding: 10px; margin: 10px 0; border-radius: 5px; }
    .method { color: #10b981; font-weight: bold; }
    code { background: #e5e7eb; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🚀 ${SERVER_NAME}</h1>
  <p>A complete backend powered only by Bun's built-in features!</p>
  
  <h2>Available Endpoints:</h2>
  <div class="endpoint">
    <span class="method">GET</span> <code>/</code> - This page
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/ping</code> - Simple health check
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/time</code> - Get server time
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/stats</code> - Database statistics
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/users</code> - List all users
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/posts</code> - List recent posts
  </div>
  <div class="endpoint">
    <span class="method">POST</span> <code>/hash</code> - Hash a password (send JSON: {"password": "text"})
  </div>
  <div class="endpoint">
    <span class="method">GET</span> <code>/uuid</code> - Generate a UUID
  </div>
  <div class="endpoint">
    <span class="method">WS</span> <code>/ws</code> - WebSocket echo server
  </div>
  
  <h2>Features Demonstrated:</h2>
  <ul>
    <li>✅ HTTP Server (Bun.serve)</li>
    <li>✅ WebSocket Support</li>
    <li>✅ SQLite Database (bun:sqlite)</li>
    <li>✅ Password Hashing (Bun.password)</li>
    <li>✅ File I/O (Bun.write, Bun.file)</li>
    <li>✅ Shell Commands (Bun $)</li>
    <li>✅ Utilities (hash, compression, UUID)</li>
    <li>✅ FFI (bun:ffi)</li>
  </ul>
  
  <p><strong>Runtime:</strong> Bun ${Bun.version}</p>
  <p><strong>Database:</strong> ${DB_NAME}</p>
</body>
</html>
        `,
        {
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Route: Ping
    if (path === "/ping") {
      return Response.json({ 
        status: "ok", 
        message: "pong",
        timestamp: Date.now() 
      });
    }

    // Route: Time
    if (path === "/time") {
      return Response.json({
        timestamp: Date.now(),
        iso: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }

    // Route: Database Stats
    if (path === "/stats") {
      const stats = db.getStats();
      return Response.json(stats);
    }

    // Route: List Users
    if (path === "/users") {
      const users = db.getAllUsers().map(u => ({
        id: u.id,
        username: u.username,
        created_at: u.created_at,
      }));
      return Response.json({ users, count: users.length });
    }

    // Route: List Posts
    if (path === "/posts") {
      const posts = db.getPosts(10);
      return Response.json({ posts, count: posts.length });
    }

    // Route: Hash Password (POST)
    if (path === "/hash" && req.method === "POST") {
      try {
        const body = await req.json();
        if (!body.password) {
          return Response.json(
            { error: "Password required" },
            { status: 400 }
          );
        }
        const hash = await Auth.hashPassword(body.password);
        return Response.json({ hash });
      } catch (error) {
        return Response.json(
          { error: "Invalid request" },
          { status: 400 }
        );
      }
    }

    // Route: Generate UUID
    if (path === "/uuid") {
      return Response.json({
        uuid: Utils.uuid(),
        timestamp: Date.now(),
      });
    }

    // Route: 404
    return Response.json(
      { error: "Not found", path },
      { status: 404 }
    );
  },

  /**
   * WebSocket message handler
   */
  websocket: {
    open(ws) {
      wsClients.add(ws);
      console.log(`🔌 WebSocket client connected (${wsClients.size} total)`);
      ws.send(JSON.stringify({ 
        type: "connected", 
        message: "Welcome to Bun WebSocket!",
        clients: wsClients.size 
      }));
    },

    message(ws, message) {
      console.log(`📨 Received: ${message}`);
      
      try {
        const data = JSON.parse(message as string);
        
        // Echo back with timestamp
        ws.send(JSON.stringify({
          type: "echo",
          original: data,
          timestamp: Date.now(),
        }));

        // Broadcast to all clients
        if (data.broadcast) {
          const broadcastMsg = JSON.stringify({
            type: "broadcast",
            message: data.message,
            from: data.from || "anonymous",
            timestamp: Date.now(),
          });
          
          for (const client of wsClients) {
            if (client !== ws) {
              client.send(broadcastMsg);
            }
          }
        }
      } catch (error) {
        // Handle plain text messages
        ws.send(JSON.stringify({
          type: "echo",
          message: message,
          timestamp: Date.now(),
        }));
      }
    },

    close(ws) {
      wsClients.delete(ws);
      console.log(`🔌 WebSocket client disconnected (${wsClients.size} remaining)`);
    },
  },
});

/**
 * Startup sequence - demonstrate all Bun features
 */
async function startup() {
  console.clear();
  console.log("╔" + "═".repeat(58) + "╗");
  console.log("║" + " ".repeat(15) + "🚀 BUN CORE BACKEND 🚀" + " ".repeat(15) + "║");
  console.log("╚" + "═".repeat(58) + "╝");
  
  console.log("\n📋 Initializing all Bun subsystems...\n");

  // 1. Database demo
  console.log("1️⃣  Database (bun:sqlite)");
  console.log("-".repeat(50));
  
  // Create sample user
  const testPassword = "SecurePass123!";
  const hashedPassword = await Auth.hashPassword(testPassword);
  
  const existingUser = db.getUser("admin");
  if (!existingUser) {
    db.createUser("admin", hashedPassword);
    console.log("✅ Created sample user: admin");
  } else {
    console.log("✅ Sample user exists: admin");
  }
  
  // Create a sample post
  const user = db.getUser("admin");
  if (user && db.getPosts(1).length === 0) {
    db.createPost(user.id, "Welcome to Bun!", "This is a sample post created with Bun's SQLite.");
    console.log("✅ Created sample post");
  }
  
  const stats = db.getStats();
  console.log(`📊 Database stats: ${stats.users} users, ${stats.posts} posts`);
  console.log("");

  // 2. Authentication demo
  await Auth.demo();

  // 3. File I/O demo
  await FileManager.demo();

  // 4. Utilities demo
  await Utils.demo();

  // 5. Shell demo
  await Shell.demo();

  // 6. FFI demo
  FFIExample.demo();

  // 7. Server info
  console.log("\n🌐 HTTP Server");
  console.log("=".repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ WebSocket available at ws://localhost:${PORT}/ws`);
  console.log("\n📝 Logging:");
  console.log(`  - Process ID: ${process.pid}`);
  console.log(`  - Bun version: ${Bun.version}`);
  console.log(`  - Platform: ${process.platform}`);
  console.log(`  - Architecture: ${process.arch}`);
  console.log("=".repeat(50));
  
  console.log("\n🎉 All systems operational! Server is ready.\n");
  console.log(`💡 Visit http://localhost:${PORT} in your browser`);
  console.log(`💡 Press Ctrl+C to stop the server\n`);
}

// Run startup sequence
startup().catch(console.error);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n🛑 Shutting down gracefully...");
  db.close();
  console.log("✅ Database closed");
  process.exit(0);
});
