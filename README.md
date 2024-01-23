# Lodging Recommendation Service With OpenAI and PostgreSQL pgvector extension

This sample app shows how to build generative AI apps using OpenAI API and the PostgreSQL pgvector extension.

The app provides recommendations for various lodging options for travelers heading to San Francisco. It operates in two distinct modes:

![openai_lodging](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service/assets/1537233/d070dfe1-50f9-4191-ae43-c80ba61deb2a)

* *OpenAI Chat Mode*: In this mode, the backend leverages the OpenAI Chat Completion API and the GPT-4 model to generate lodging recommendations based on the user's input.
* *Postgres Embeddings Mode*: Initially, the backend employs the OpenAI Embeddings API to generate an embedding from the user's input. Subsequently, the server utilizes the PostgreSQL pgvector extension to perform a vector search among the sample Airbnb properties stored in the database. You can use PostgreSQL or YugabyteDB.

## Prerequisites

* [OpenAI API key](https://platform.openai.com)
* [git-lfs](https://github.com/git-lfs/git-lfs) - Git needs this extension to download a large data set file used by this sample app.

## Start the Database

The pgvector extension is supported by both PostgresSQL and YugabyteDB. Follow the steps below for starting a database instance using a docker image with pgvector. 

(Note, the sample data set includes embeddings generated with the `text-embedding-ada-002` model. If you need to use a different model, preload the data following the instructions below and then use the `backend/node/embeddings_generator.js` to regenerate the embeddings using your model).

### YugabyteDB 

1. Launch a 3-node YugabyteDB cluster of version 2.19.2.0 or later:
    ```shell
    mkdir ~/yugabyte_volume

    docker network create custom-network

    docker run -d --name yugabytedb-node1 --net custom-network \
        -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
        -v ~/yugabyte_volume/node1:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:latest \
        bin/yugabyted start \
        --base_dir=/home/yugabyte/yb_data --daemon=false
    
    docker run -d --name yugabytedb-node2 --net custom-network \
        -p 15434:15433 -p 7002:7000 -p 9002:9000 -p 5434:5433 \
        -v ~/yugabyte_volume/node2:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:latest \
        bin/yugabyted start --join=yugabytedb-node1 \
        --base_dir=/home/yugabyte/yb_data --daemon=false
        
    docker run -d --name yugabytedb-node3 --net custom-network \
        -p 15435:15433 -p 7003:7000 -p 9003:9000 -p 5435:5433 \
        -v ~/yugabyte_volume/node3:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:latest \
        bin/yugabyted start --join=yugabytedb-node1 \
        --base_dir=/home/yugabyte/yb_data --daemon=false
    ```
2. Copy the Airbnb schema and data to the first node's container:
    ```shell
    docker cp {project_dir}/sql/airbnb_listings.sql yugabytedb-node1:/home
    docker cp {project_dir}/sql/airbnb_listings_with_embeddings.csv yugabytedb-node1:/home
    ```
    *Make sure you have the git-lfs installed at the time you clone the project. The `airbnb_listings_with_embeddings.csv` file is stored in the Git Large File Storage.*


3. Load the dataset to the cluster (note, it can take a minute to load the data):
    ```shell
    docker exec -it yugabytedb-node1 bin/ysqlsh -h yugabytedb-node1 -c '\i /home/airbnb_listings.sql'
    docker exec -it yugabytedb-node1 bin/ysqlsh -h yugabytedb-node1 \
        -c "\copy airbnb_listing from /home/airbnb_listings_with_embeddings.csv with DELIMITER '^' CSV"
    ```

### PostgreSQL

1. Launch a Postgres instance using the docker image with pgvector:
    ```shell
    mkdir ~/postgres-volume/

    docker run --name postgres \
        -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -v ~/postgres-volume/:/var/lib/postgresql/data -d ankane/pgvector:latest
    ```

2. Copy the Airbnb schema and data to the container:
    ```shell
    docker cp {project_dir}/sql/airbnb_listings.sql postgres:/home
    docker cp {project_dir}/sql/airbnb_listings_with_embeddings.csv postgres:/home
    ```
    *Make sure you have the git-lfs installed at the time you clone the project. The `airbnb_listings_with_embeddings.csv` file is stored in the Git Large File Storage.*


4. Load the dataset to Postgres (note, it can take a minute to load the data):
    ```shell
    docker exec -it postgres psql -U postgres -c '\i /home/airbnb_listings.sql'
    docker exec -it postgres psql -U postgres \
        -c "\copy airbnb_listing from /home/airbnb_listings_with_embeddings.csv with DELIMITER '^' CSV"
    ```

## Starting the Application

1. Start one of the available backend implementations:
    * [Java backend](backend/java/README.md)
    * [Node.js backend](backend/node/README.md)
2. Start the React frontend:
    ```shell
    cd {project_dir}/frontend
    npm i
    npm start
    ```
3. Access the application's user interface at:
    http://localhost:3000

Enjoy exploring the app and toggling between the two modes: *OpenAI Chat* and *Postgres Embeddings*. The latter is significantly faster.

**Note**: Ensure you request recommendations specifically for lodging in San Francisco, as this is the AI's primary focus.

![app_screenshot](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service/assets/1537233/58c573d6-7632-4cf4-96e1-066d3b0c6314)

Here are some sample prompts to get you started:
```
We're traveling to San Francisco from October 21st through 28th. We need a hotel with parking.

I'm looking for an apartment near the Golden Gate Bridge with a Bay view.

I'd like a hotel near Fisherman's Wharf with a Bay view.

An apartment close to the Salesforce Tower, within walking distance of Blue Bottle Coffee.
```
