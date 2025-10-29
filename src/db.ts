/**
 * db.ts - Bun SQLite Database Module
 * Demonstrates: bun:sqlite for database operations
 */

import { Database } from "bun:sqlite";

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: number;
}

export class AppDatabase {
  private db: Database;

  constructor(filename: string = "core.db") {
    this.db = new Database(filename, { create: true });
    this.initSchema();
  }

  private initSchema(): void {
    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);

    // Create posts table for demonstration
    this.db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("✅ Database schema initialized");
  }

  // User operations
  createUser(username: string, passwordHash: string): User | null {
    try {
      const stmt = this.db.prepare(
        "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)"
      );
      const result = stmt.run(username, passwordHash, Date.now());
      
      return this.getUser(username);
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  getUser(username: string): User | null {
    const stmt = this.db.prepare("SELECT * FROM users WHERE username = ?");
    return stmt.get(username) as User | null;
  }

  getAllUsers(): User[] {
    const stmt = this.db.query("SELECT * FROM users");
    return stmt.all() as User[];
  }

  // Post operations
  createPost(userId: number, title: string, content: string): number {
    const stmt = this.db.prepare(
      "INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(userId, title, content, Date.now());
    return Number(result.lastInsertRowid);
  }

  getPosts(limit: number = 10): any[] {
    const stmt = this.db.query(`
      SELECT p.*, u.username 
      FROM posts p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  close(): void {
    this.db.close();
  }

  // Utility method to check database stats
  getStats(): any {
    const userCount = this.db.query("SELECT COUNT(*) as count FROM users").get() as any;
    const postCount = this.db.query("SELECT COUNT(*) as count FROM posts").get() as any;
    
    return {
      users: userCount.count,
      posts: postCount.count,
      filename: this.db.filename,
    };
  }
}
