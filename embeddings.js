const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: "The quick brown fox jumped over the lazy dog",
    });

    for (let i = 0; i < embedding.data.length; i++) {
        console.log(embedding.data[i]);
    }
}

main();