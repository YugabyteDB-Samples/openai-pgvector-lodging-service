const { OpenAI } = require("openai");

(async () => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "system", content:
                    "You're a helpful assistant that helps to find lodging. Suggest at least three options with a link to the website." +
                    "Use the ChatGPT Expedia plugin."
            },
            {
                role: "user", content:
                    "We're traveling to San Francisco from October 21st through 28th" +
                    "and looking for a hotel with a view of the Bay near the Fisherman Wharf.We need a refrigerator and a hair dryer."
            }
        ],
        model: "gpt-4",
    });

    chatCompletion.choices.forEach(choice => { console.log(choice) });
})();
