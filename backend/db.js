import { DB } from "https://deno.land/x/sqlite@v3.0.0/mod.ts";

// Open database
const db = new DB("events.db");

// Setup table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        desc TEXT,
        at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

// API
export function addEvent(text) {
    db.query("INSERT INTO events (desc) VALUES (?)", [text]);
}

export function removeEvent(id) {
    db.query("DELETE FROM events WHERE (id == ?)", [id]);
}

export function updateEvent(id, text) {
    db.query("UPDATE events SET desc = ? WHERE (id == ?)", [text, id]);
}

export function getEvent(id) {
    return db.query("SELECT * FROM events WHERE (id == ?)", [id]);
}

export function getAllEvents() {
    return db.query("SELECT * FROM events");
}

export function closeDB() {
    db.close();
}