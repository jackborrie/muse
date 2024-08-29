CREATE TABLE IF NOT EXISTS user_books (
    user_id TEXT NOT NULL REFERENCES "AspNetUsers"("Id"),
    book_id TEXT NOT NULL REFERENCES books(id),
    creation_date TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);