CREATE TABLE IF NOT EXISTS user_books (
    user_id TEXT NOT NULL REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    creation_date TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);