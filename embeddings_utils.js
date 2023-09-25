function checkEmbeddingValid(embedding) {
    if (embedding == undefined || embedding.data == undefined || embedding.data[0].embedding == undefined) {
        console.log("Error generating an embedding: " + JSON.stringify(embedding));
        return false;
    }

    if (embedding.data.length > 1) {
        console.log("Unsupported: more than one embedding returned: " + JSON.stringify(embedding));
        return false;
    }

    if (embedding.data[0].embedding.length != 1536) {
        console.log("Unsupported: embedding length is not 1536: " + JSON.stringify(embedding.data[0].embedding.length));
        return false;
    }

    return true;
}

module.exports = { checkEmbeddingValid };