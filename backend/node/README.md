# Start Node.js Backend

1. Provide your OpenAI API Key in the  `application.properties.ini` file:
    ```properties
    OPENAI_API_KEY=<your key>
    ```

2. If you use YugabyteDB, then update database connectivity settings in the `application.properties.ini` file to the following:
    ```properties
    DATABASE_HOST=localhost
    DATABASE_PORT=5433
    DATABASE_NAME=yugabyte
    DATABASE_USER=yugabyte
    DATABASE_PASSWORD=yugabyte
    ```

3. Initiate the Node.js backend:
    ```shell
    cd {project_dir}/backend/node
    npm i 
    npm start
    ```