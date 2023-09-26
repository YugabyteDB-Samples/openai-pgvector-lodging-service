const { OpenAI } = require("openai");
const { Client } = require("pg");
const { checkEmbeddingValid } = require("./embeddings_utils.js");

class PostgresEmbeddingsService {

    #openai;

    #pgEndpoint = {
        host: "localhost",
        port: 5432,
        database: "postgres",
        user: "postgres",
        password: "password"
    };

    #client;

    constructor() { }

    async connect() {
        this.#openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.#client = new Client(this.#pgEndpoint);

        await this.#client.connect();

        console.log("Connected to Postgres");
    }

    async searchPlaces(prompt, matchThreshold, matchCnt) {
        prompt = prompt.replace(/\n/g, ' ');

        const embeddingResp = await this.#openai.embeddings.create(
            {
                model: "text-embedding-ada-002",
                input: prompt
            }
        );

        if (!checkEmbeddingValid(embeddingResp)) {
            return { "error": "Failed to generate an embedding for the prompt" };
        }

        const res = await this.#client.query(
            "SELECT name, description, price, 1 - (description_embedding <=> $1) as similarity " +
            "FROM airbnb_listing WHERE 1 - (description_embedding <=> $1) > $2 ORDER BY similarity DESC LIMIT $3",
            ['[' + embeddingResp.data[0].embedding + ']', matchThreshold, matchCnt]);

        let places = [];

        for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows[i];

            places.push(
                { "name": row.name, "description": row.description, "price": row.price, "similarity": row.similarity });

            console.log(`${row.name}, ${row.similarity}, ${row.price} \n ${row.description}`);
            console.log("\n\n--------------------------------------------------");
        }

        return places;
    }
}

module.exports.PostgresEmbeddingsService = PostgresEmbeddingsService;