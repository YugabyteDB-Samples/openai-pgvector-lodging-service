# Lodging Recommendation Service With OpenAI and PostgreSQL pgvector extension

This is a sample Node.JS and React application that demonstrates how to build AI-powered apps using the OpenAI API and PostgreSQL pgvector extension.

The app provides recommendations for various lodging options for travelers heading to San Francisco. It operates in two distinct modes:

![openai_lodging-2](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service/assets/1537233/99d8c571-bf6c-4bab-970c-5df9f6a76080)

* *OpenAI Chat Mode*: In this mode, the Node.js backend leverages the OpenAI Chat Completion API and the GPT-4 model to generate lodging recommendations based on the user's input.
* *Postgres Embeddings Mode*: Initially, the backend employs the OpenAI Embeddings API to generate an embedding from the user's input. Subsequently, the server utilizes the PostgreSQL pgvector extension to perform a vector search among the sample Airbnb properties stored in the database. You can use PostgreSQL or YugabyteDB.

## Prerequisites

* [OpenAI API key](https://platform.openai.com)
* [git-lfs](https://github.com/git-lfs/git-lfs)

## Start the Database

The pgvector extension is supported by both PostgresSQL and YugabyteDB. Follow the steps below for starting a database instance using a docker image with pgvector. 

### YugabyteDB 

1. Launch a 3-node YugabyteDB cluster of version 2.19.2.0 or later:
    ```shell
    mkdir ~/yb_docker_data

    docker network create custom-network

    docker run -d --name yugabytedb-node1 --net custom-network \
        -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
        -v ~/yb_docker_data/node1:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:2.19.2.0-b121 \
        bin/yugabyted start \
        --base_dir=/home/yugabyte/yb_data --daemon=false
    
    docker run -d --name yugabytedb-node2 --net custom-network \
        -p 15434:15433 -p 7002:7000 -p 9002:9000 -p 5434:5433 \
        -v ~/yb_docker_data/node2:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:2.19.2.0-b121 \
        bin/yugabyted start --join=yugabytedb-node1 \
        --base_dir=/home/yugabyte/yb_data --daemon=false
        
    docker run -d --name yugabytedb-node3 --net custom-network \
        -p 15435:15433 -p 7003:7000 -p 9003:9000 -p 5435:5433 \
        -v ~/yb_docker_data/node3:/home/yugabyte/yb_data --restart unless-stopped \
        yugabytedb/yugabyte:2.19.2.0-b121 \
        bin/yugabyted start --join=yugabytedb-node1 \
        --base_dir=/home/yugabyte/yb_data --daemon=false
    ```
2. Run the script to create the Airbnb listings table and activate the pgvector extension:
    ```shell
    psql -h 127.0.0.1 -p 5433 -U yugabyte -d yugabyte {project_dir}/sql/airbnb_listings.sql
    ```

3. Update the default database connectivity settings in the `{project_dir}/application.properties.ini` file to the following:
    ```properties
    DATABASE_HOST=localhost
    DATABASE_PORT=5433
    DATABASE_NAME=yugabyte
    DATABASE_USER=yugabyte
    DATABASE_PASSWORD=yugabyte
    ```

### PostgreSQL

1. Launch a Postgres instance using the docker image with pgvector:
    ```shell
    mkdir ~/postgres-volume/

    docker run --name postgresql \
        -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -v ~/postgres-volume/:/var/lib/postgresql/data -d ankane/pgvector:latest
    ```

2. Copy the Airbnb schema and data to the container:
    ```shell
    docker cp {project_dir}/sql/airbnb_listings.sql postgres:/home
    docker cp {project_dir}/sql/airbnb_listings_with_embeddings.csv postgres:/home
    ```

3. Load the dataset to Postgres (note, it can take a minute to load the data):
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
