import { DatabaseSync } from 'node:sqlite'
import { chmodSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { useRuntimeConfig } from '#imports'

export interface StoredUser {
  id: string
  email: string
  password_hash: string | null
}

let database: DatabaseSync

export function authDatabase() {
  if (database) return database
  const path = resolve(useRuntimeConfig().authDatabasePath)
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  database = new DatabaseSync(path)
  chmodSync(path, 0o600)
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS auth_identities (
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (provider, provider_user_id)
    );
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bridge_id TEXT NOT NULL,
      name TEXT NOT NULL,
      ip TEXT NOT NULL,
      credential TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_connected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, bridge_id)
    );
    CREATE TABLE IF NOT EXISTS auth_attempts (
      key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `)
  return database
}

export function findUserByEmail(email: string) {
  return authDatabase().prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .get(email) as StoredUser | undefined
}
