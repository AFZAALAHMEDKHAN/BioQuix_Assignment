const express = require('express')
const {getContainerFromLLM} = require('../services/llm_service')
const { exec } = require('child_process');

const process_request = async (req, res) => {
  const task = req.body.task; // Get task from the request
  const data = req.body.data; // Get data from the request

  console.log("Received task:", task);
  console.log("Received data:", data);

  const containerName = await getContainerFromLLM(task);
  console.log("LLM suggested container:", containerName);

  if (containerName && containerName !== 'none') {
    let dockerCommand = `docker run --rm `; // Base command

    // Assuming that data is text to be passed as input

    if (containerName === "text_length_counter") {
      dockerCommand += `-e TEXT_TO_COUNT="${data}" ${containerName}`; // Pass data
    }
    
    else if (containerName === "basic_sentiment_analyzer") {
      dockerCommand += `-e TEXT_TO_ANALYZE="${data}" ${containerName}`; // Pass data
    } 
    
    else if (containerName === "named_entity_extractor") {
      dockerCommand += `-e TEXT_TO_PROCESS="${data}" ${containerName}`; // Pass data
    } 
    
    else {
      return res.status(400).send(`Unknown container: ${containerName}`);
    }

    exec(dockerCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running Docker container: ${error.message}`);
            console.error(`Container exited with code: ${error.code}`); // Get exit code
            console.error(`stderr: ${stderr}`);
            return res.status(500).send(`Container error: ${error.message}`);
        }

        if (stderr) {
            console.error("Docker container error output:\n", stderr);
            return res.status(500).send(`Container finished with errors:\n${stderr}`);
        }

        if (stdout) {
            console.log("Docker container output:\n", stdout);
            try {
                const output = JSON.parse(stdout); // Try to parse as JSON
                return res.send({ result: output }); // Send parsed JSON
            }
            catch (parseError) {
            // If parsing fails, send raw output
                console.log("Container output is not JSON:\n", stdout);
                return res.send(`Container finished. Output:\n${stdout}`);
            }
        }

        return res.send(`Container "${containerName}" finished. No output.`);
    });
  }
  else {
    res.send("No suitable container found.");
  }   
}


module.exports = {process_request}