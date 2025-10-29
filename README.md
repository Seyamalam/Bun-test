# 🚀 Bun Core Backend

A complete backend system built **exclusively** with Bun's built-in features — no external dependencies whatsoever!

## 🎯 Overview

This project demonstrates how Bun alone can power a full-featured backend system including:
- HTTP/HTTPS server
- WebSocket support
- SQLite database
- Password authentication
- File I/O operations
- Shell command execution
- FFI (Foreign Function Interface)
- Utility functions (hashing, compression, UUID, etc.)

**Zero dependencies. Zero setup. Just Bun.**

## 🏗️ Project Structure

```
bun-core-backend/
├── src/
│   ├── server.ts        # Main HTTP server with WebSocket support
│   ├── db.ts           # SQLite database operations
│   ├── auth.ts         # Password hashing and verification
│   ├── files.ts        # File read/write operations
│   ├── utils.ts        # Utilities (hash, compression, UUID, etc.)
│   ├── shell.ts        # Shell command execution
│   └── ffi_example.ts  # FFI demonstration with C library
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+ installed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bun-core-backend
```

2. Run the server:
```bash
bun run dev
# or
bun run src/server.ts
```

That's it! No `npm install`, no dependencies, no build step.

## 🌐 API Endpoints

The server runs on `http://localhost:3000` by default.

### HTTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page with documentation |
| `GET` | `/ping` | Health check endpoint |
| `GET` | `/time` | Get server timestamp |
| `GET` | `/stats` | Database statistics |
| `GET` | `/users` | List all users |
| `GET` | `/posts` | List recent posts |
| `POST` | `/hash` | Hash a password |
| `GET` | `/uuid` | Generate a random UUID |

### WebSocket

- `ws://localhost:3000/ws` - WebSocket echo and broadcast server

## 📋 Features Demonstrated

### 1. HTTP & WebSocket Server (`server.ts`)

```typescript
import { serve } from "bun";

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    // Handle HTTP requests
  },
  websocket: {
    // Handle WebSocket connections
  }
});
```

### 2. SQLite Database (`db.ts`)

```typescript
import { Database } from "bun:sqlite";

const db = new Database("core.db");
db.run("CREATE TABLE users (...)");
```

### 3. Password Authentication (`auth.ts`)

```typescript
// Hash password
const hash = await Bun.password.hash("password", {
  algorithm: "bcrypt",
  cost: 10
});

// Verify password
const valid = await Bun.password.verify("password", hash);
```

### 4. File I/O (`files.ts`)

```typescript
// Write file
await Bun.write("file.txt", "content");

// Read file
const file = Bun.file("file.txt");
const content = await file.text();
```

### 5. Utilities (`utils.ts`)

```typescript
// Hashing
const hash = new Bun.CryptoHasher("sha256").update("data").digest("hex");

// Compression
const compressed = Bun.gzipSync("data");

// UUID
const id = crypto.randomUUID();

// Deep equality
const equal = Bun.deepEquals(obj1, obj2);

// Sleep
await Bun.sleep(1000);
```

### 6. Shell Execution (`shell.ts`)

```typescript
import { $ } from "bun";

const output = await $`ls -la`.text();
const date = await $`date`.text();
```

### 7. FFI - Foreign Function Interface (`ffi_example.ts`)

```typescript
import { dlopen, FFIType } from "bun:ffi";

const lib = dlopen("libc.so.6", {
  strlen: {
    args: [FFIType.cstring],
    returns: FFIType.i32,
  }
});

const length = lib.symbols.strlen(buffer);
```

## 🧪 Testing

### Test HTTP Endpoints

```bash
# Ping
curl http://localhost:3000/ping

# Get time
curl http://localhost:3000/time

# Get stats
curl http://localhost:3000/stats

# Hash password
curl -X POST http://localhost:3000/hash \
  -H "Content-Type: application/json" \
  -d '{"password":"test123"}'
```

### Test WebSocket

```javascript
const ws = new WebSocket("ws://localhost:3000/ws");

ws.onopen = () => {
  ws.send(JSON.stringify({ message: "Hello!" }));
};

ws.onmessage = (event) => {
  console.log("Received:", event.data);
};
```

## 🔧 Configuration

Environment variables can be set in a `.env` file:

```env
PORT=3000
DB_NAME=core.db
SERVER_NAME=Bun Core Backend
```

## 📊 What's Included

- ✅ **HTTP Server** - Fast HTTP/1.1 server with routing
- ✅ **WebSocket** - Real-time bidirectional communication
- ✅ **SQLite Database** - Embedded SQL database
- ✅ **Authentication** - bcrypt and argon2id password hashing
- ✅ **File I/O** - Read/write text, JSON, and binary files
- ✅ **Shell Execution** - Run system commands
- ✅ **Utilities** - Hash, compress, UUID, sleep, and more
- ✅ **FFI** - Call native C libraries
- ✅ **TypeScript** - Full TypeScript support out of the box

## 🎓 Key Learnings

This project demonstrates:

1. **Zero-dependency architecture** - Everything using only Bun's built-in APIs
2. **Performance** - Bun's native implementations are fast and efficient
3. **Simplicity** - No build tools, no configuration complexity
4. **Modern APIs** - Clean, promise-based interfaces
5. **Type safety** - Full TypeScript support without extra tooling

## 📝 Notes

- No external packages required - everything uses `bun:*` imports
- Database file (`core.db`) is created automatically on first run
- Test data is generated on startup
- All demos run automatically when the server starts

## 🔒 Security

This is a demonstration project. For production use:

- Add rate limiting
- Implement proper authentication middleware
- Use environment variables for sensitive data
- Add input validation and sanitization
- Implement proper error handling
- Use HTTPS in production

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Bun API Reference](https://bun.sh/docs/api)
- [Bun Runtime APIs](https://bun.sh/docs/runtime)

## 📄 License

MIT

## 🤝 Contributing

This is a demonstration project showcasing Bun's capabilities. Feel free to explore and learn!

---

**Built with ❤️ using only Bun**
