CREATE TABLE IF NOT EXISTS collections (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    title TEXT NOT NULL,
    isbn TEXT,
    path TEXT,
    description TEXT,
    has_cover BOOLEAN DEFAULT false,
    has_initial_search BOOLEAN DEFAULT false,
    read double precision DEFAULT 0
);

CREATE TABLE IF NOT EXISTS collection_books (
    collection_id TEXT REFERENCES collections(id) ON DELETE CASCADE,
    book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, book_id)
);

CREATE TABLE IF NOT EXISTS authors (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS author_books (
    author_id TEXT REFERENCES authors(id) ON DELETE CASCADE,
    book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
    index integer,
    PRIMARY KEY (author_id, book_id)
);