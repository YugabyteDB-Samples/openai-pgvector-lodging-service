```sql
\i ~/Downloads/sample_projects/openai-lodging-service/sql/airbnb_listing.sql
\copy airbnb_listing from '~/Downloads/sample_projects/openai-lodging-service/sql/sf_airbnb_listings.csv' DELIMITER ',' CSV HEADER;
```