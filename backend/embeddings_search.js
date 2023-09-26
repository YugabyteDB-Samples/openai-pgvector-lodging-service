const { OpenAI } = require("openai");
const { Client } = require("pg");
const { checkEmbeddingValid } = require("./embeddings_utils.js");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pgEndpoint = {
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "password"
};

async function main() {
    const client = new Client(pgEndpoint);
    await client.connect();

    console.log("Connected to Postgres");

    let prompt = "An apartment near the Salesforce Tower in a walking distance to the Blue Bottle Coffee. ";

    const embeddingResp = await openai.embeddings.create(
        {
            model: "text-embedding-ada-002",
            input: prompt
        }
    );

    if (!checkEmbeddingValid(embeddingResp)) {
        return;
    }

    const matchThreshold = 0.5;
    const matchCnt = 5;

    const res = await client.query(
        "SELECT name, description, price, 1 - (description_embedding <=> $1) as similarity " +
        "FROM airbnb_listing WHERE 1 - (description_embedding <=> $1) > $2 ORDER BY similarity DESC LIMIT $3",
        ['[' + embeddingResp.data[0].embedding + ']', matchThreshold, matchCnt]);

    for (let i = 0; i < res.rows.length; i++) {
        const row = res.rows[i];

        console.log(`${row.name}, ${row.similarity}, ${row.price} \n ${row.description}`);
        console.log("\n\n--------------------------------------------------");
    }

    process.exit(0);
}

main();