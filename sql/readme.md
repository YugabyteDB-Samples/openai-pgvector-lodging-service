```sql
-- create schema and load data without embeddings
\i ~/Downloads/sample_projects/openai-lodging-service/sql/01_airbnb_listing.sql
\copy airbnb_listing from '~/Downloads/sample_projects/openai-lodging-service/sql/sf_airbnb_listings.csv' DELIMITER ',' CSV HEADER;

-- dump from postgres with embeddings
pg_dump -h 127.0.0.1 -U postgres --table public.airbnb_listing --file /home/airbnb_data_with_embeddings.sql --data-only --inserts --format plain
docker container cp postgresql:/home/airbnb_data_with_embeddings.sql ~/Downloads/airbnb_data_with_embeddings.sql

-- load from a YugabyteDB psql connection
\i ~/Downloads/airbnb_data_with_embeddings.sql


-- Another Approach: on Postgres
\copy (SELECT id, description_embedding FROM airbnb_listing) to /Users/dmagda/Downloads/airbnb_listing_embeddings.csv with DELIMITER '^' CSV;

-- On YugabyteDB
create table airbnb_embedding(id bigint, embedding vector(1536));
\copy airbnb_embedding(id,embedding) from '<path>/airbnb_listing_embeddings.csv' with DELIMITER '^' CSV;
drop table airbnb_embedding;
```