-- 1. Table for persistent birthday wishes
CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table for unlockable memories / notes
CREATE TABLE IF NOT EXISTS secret_memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unlock_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    secret_note TEXT NOT NULL
);

-- 3. Initial secret memories (replace with your custom clues and messages)
INSERT OR IGNORE INTO secret_memories (unlock_code, title, secret_note)
VALUES 
    ('specialdate', 'Our First Memory', 'From the day we first spoke, you have brought so much happiness into my life. Happy Birthday!'),
    ('favoriteplace', 'A Special Place', 'Remember that quiet spot we talked about? Looking forward to making more memories there.');