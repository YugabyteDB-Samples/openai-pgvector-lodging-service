# Start Java Backend

0. Install Java 21+

1. Provide your OpenAI API Key int the `application.properties` file:
    ```properties
    OPENAI_API_KEY=<your key>
    ```

2. If you use YugabyteDB, then update database connectivity settings in the `application.properties` file to the following:
    ```properties
    spring.datasource.url = jdbc:postgresql://127.0.0.1:5433/yugabyte
    spring.datasource.username = yugabyte
    spring.datasource.password = yugabyte
    ```

3. Start the Spring Boot backend:
    ```shell
    cd {project_dir}/backend/java
    mvn spring-boot:run
    ```