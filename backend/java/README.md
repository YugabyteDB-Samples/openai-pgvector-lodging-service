# Start Java Backend

0. Install Java 21+

1. Provide your OpenAI API Key int the `application.properties` file:
    ```properties
    OPENAI_API_KEY=<your key>
    ```

2. Start the Spring Boot backend:
    ```shell
    cd {project_dir}/backend/java
    mvn spring-boot:run
    ```