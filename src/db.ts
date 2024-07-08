import { Database } from 'bun:sqlite';

export interface User {
  id: number;
  name: string;
  email: string;
}

const db = new Database('users.sqlite');

db.query(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
)`).run();

export function addUser(user: Omit<User, 'id'>): User {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const result = stmt.run(user.name, user.email);
  return { id: result.lastInsertRowid as number, ...user };
}

export function getUsers(): User[] {
  return db.query('SELECT * FROM users').all() as User[];
}

export function getUserById(id: number): User | undefined {
  return db.query('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}
