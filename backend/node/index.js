const express = require('express');
const { PostgresEmbeddingsService } = require('./postgres_embeddings_service.js');
const { OpenAIChatService } = require('./openai_chat_service.js');
const PropertiesReader = require('properties-reader');

const properties = PropertiesReader(__dirname + '/application.properties.ini');

const PORT = properties.get('EXPRESS_SERVER_PORT');

const postgresService = new PostgresEmbeddingsService();
const openaiService = new OpenAIChatService();

const app = express();

app.get('/search', async (req, res) => {
    const prompt = req.query.prompt;
    const engine = req.query.engine;

    if (prompt == undefined) {
        res.send('Pass a prompt in the URL, e.g. /search?prompt=Hello');
    } else {
        let places;

        if (engine == 'postgres') {
            places = await postgresService.searchPlaces(prompt, 0.7, 3);
        } else {
            places = await openaiService.searchPlaces(prompt);
        }

        res.send(places);
    }
});

app.listen(PORT, async () => {
    console.log(`Server listening on ${PORT}`);
    await postgresService.connect();
    openaiService.connect();
});