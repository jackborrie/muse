ALTER TABLE collections
ADD COLUMN user_id TEXT REFERENCES "AspNetUsers"("Id");