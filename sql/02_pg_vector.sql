CREATE EXTENSION IF NOT EXISTS vector;

-- The text-embedding-ada-002 model produces 1536-dimensional embeddings.
ALTER TABLE airbnb_listing ADD COLUMN description_embedding vector(1536);