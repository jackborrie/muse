ALTER TABLE kobos 
ADD COLUMN collection_id TEXT REFERENCES collections(id);

ALTER TABLE "AspNetUsers"
ADD COLUMN websocket_token TEXT;