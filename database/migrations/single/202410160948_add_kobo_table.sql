CREATE TABLE IF NOT EXISTS kobos
(
    id   TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    get_public BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES "AspNetUsers"("Id")
)