const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.get('/search', (req, res) => {
    const prompt = req.query.prompt;

    if (prompt == undefined) {
        res.send('Pass a prompt in the URL, e.g. /search?prompt=Hello');
    } else {
        res.send(`Hello ${prompt}!`);
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});