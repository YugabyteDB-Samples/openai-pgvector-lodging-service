# Lodging Recommendation Service With OpenAI and PostgreSQL pgvector extension

This is a sample Node.JS and React application that demonstrates how to build AI-powered apps using the OpenAI API and PostgreSQL pgvector extension.

The app provides recommendations for various lodging options for travelers heading to San Francisco. It operates in two distinct modes:

![openai_lodging](https://github.com/YugabyteDB-Samples/openai-lodging-service/assets/1537233/97edce33-000d-4842-b7c7-f8a229862573)

* *OpenAI Chat Mode*: In this mode, the Node.js backend leverages the OpenAI Chat Completion API and the GPT-4 model to generate lodging recommendations based on the user's input.
* *Postgres Embeddings Mode*: Initially, the backend employs the OpenAI Embeddings API to generate an embedding from the user's input. Subsequently, the server utilizes the PostgreSQL pgvector extension to perform a vector search among the sample Airbnb properties stored in the database.

## Prerequisites

* CA ChatGPT Plus subscription (required if you've exhausted the initial free credits): https://platform.openai.com

## Start the Database

To initiate and set up the database:

1. Launch a Postgres instance using the docker image with pgvector:
    ```shell
    mkdir ~/postgresql_data/

    docker run --name postgresql \
        -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -v ~/postgresql_data/:/var/lib/postgresql/data -d ankane/pgvector:latest
    ```

2. Run the script to create the Airbnb listings table and activate the pgvector extension:
    ```shell
    psql -h 127.0.0.1 -U postgres -d postgres -a -q -f {project_dir}/sql/airbnb_listings.sql
    ```

## Loading the Sample Data Set

You can populate the Airbnb listings table with sample data in two ways.

**First Option**: Preload the original sample data set without embeddings, then utilize the OpenAI Embeddings API to generate embeddings for Airbnb listing descriptions. This method may take over 10 minutes:

1. Load the orignal Airbnb data set:
    ```sql
    psql -h 127.0.0.1 -U postgres

    alter table airbnb_listing drop column description_embedding;
    \copy airbnb_listing from '{project_dir}/sql/sf_airbnb_listings.csv' DELIMITER ',' CSV HEADER;
    alter table airbnb_listing add column description_embedding vector(1536);
    ```
2. Provide your OpenAI API Key in the `{project_dir}/application.properties.ini` file:
    ```shell
    OPENAI_API_KEY=<your key>
    ```
3. Launch the embeddings generator:
    ```shell
    cd {project_dir}/backend
    node embeddings_generator.js
    ```

**Second Option**: Download the Airbnb data set with pre-generated embeddings and import it into the database:

1. Download the data set (170 MB): https://drive.google.com/file/d/1DV8OMoiTd-7PSo78yN82CP40kLce0gx-/view?usp=sharing

2. Import the data set into the database:
    ```sql
    psql -h 127.0.0.1 -U postgres

    \copy airbnb_listing from '{full_path_to_the_file}/airbnb_listings_with_embeddings.csv' with DELIMITER '^' CSV;
    ```

## Starting the Application

1. Update the `{project_dir}/application.properties.ini` file with your OpenAI API Key:
    ```shell
    OPENAI_API_KEY=<your key>
    ```

2. Initiate the Node.js backend:
    ```shell
    cd {project_dir}/backend
    npm start
    ```
3. Start the React frontend:
    ```shell
    cd {project_dir}/backend
    npm start
    ```

4. Access the application's user interface at:
    http://localhost:3000

Enjoy exploring the app and toggling between the two modes: *OpenAI Chat* and *Postgres Embeddings*. The latter is significantly faster.

**Note**: Ensure you request recommendations specifically for lodging in San Francisco, as this is the AI's primary focus.

![app_screenshot](https://github.com/YugabyteDB-Samples/openai-lodging-service/assets/1537233/dfedf695-c6e1-43ae-bfd4-f75e9ad03f68)

Here are some sample prompts to get you started:
```
We're traveling to San Francisco from October 21st through 28th. We need a hotel with parking.

Apartments near the Golden Gate Bridge with a Bay view.

I'd like a hotel near Fisherman's Wharf with a Bay view.

An apartment close to the Salesforce Tower, within walking distance of Blue Bottle Coffee.
```
