const express = require('express')
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const  request_handler = require('./routes/request_handler')

dotenv.config() //Loading the env variables


const groqApiKey = process.env.LLM_KEY;
const port = process.env.PORT || 3000;

const app = express()


app.use(express.json()); //to parse incoming requests with json payloads

app.use('/request', request_handler);

app.listen(port, () => {
    console.log(`Orchestrator listening at http://localhost:${port}`);
});