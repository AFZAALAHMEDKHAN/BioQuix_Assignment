const fetch = require('node-fetch')
const dotenv = require('dotenv')
const { exec } = require('child_process');

dotenv.config()

const groqApiKey = process.env.LLM_KEY;



async function getContainerFromLLM(task) {
    const prompt = `You are an AI agent that helps determine which containerized task to run based on a user's request.
        Available tasks: ["text_length_counter", "basic_sentiment_analyzer", "named_entity_extractor"].
        User request: "${task}".
        Return *only* the name of the container from the list above. Do not include any other words or explanations.
        If no container is suitable, return "none".`;

    const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "user", content: prompt }
        ],
        max_tokens: 50, // Limit the response length
    };

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`LLM API Error: ${response.status} - ${response.statusText}`);
            return "none";
        }

        const data = await response.json();
        // Extract the container name from the response
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const containerName = data.choices[0].message.content.trim();
            return containerName;
        } else {
            console.error("LLM API response missing expected content:", data);
            return "none";
        }

    } catch (error) {
        console.error("Error calling LLM API:", error);
        return "none";
    }
}


module.exports = {getContainerFromLLM}