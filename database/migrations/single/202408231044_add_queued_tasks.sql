CREATE TABLE IF NOT EXISTS queued_tasks (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    function INT NOT NULL,
    status INT NOT NULL,
    creation_date TIMESTAMP DEFAULT NOW(),
    start_time TIMESTAMP,
    finish_time TIMESTAMP,
    attempts INT DEFAULT 0,
    task_data JSON,
    user_id TEXT NOT NULL REFERENCES "AspNetUsers"("Id")
);