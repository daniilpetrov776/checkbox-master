import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для открытия базы данных
export async function getDB() {
    return open({
      filename: path.resolve(__dirname, "database.sqlite"),
      driver: sqlite3.Database,
    });
  }
  
  // Инициализация таблицы
  export async function initDB() {
    const db = await getDB();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS checkboxes (
        id INTEGER PRIMARY KEY,
        checked BOOLEAN NOT NULL DEFAULT 0
      )
    `);
  }