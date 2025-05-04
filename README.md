# 🧠 AI Orchestrator with LLM and Dockerized NLP Microservices

## 📌 Overview

This project implements an **AI Orchestrator** using Node.js that integrates with a **Groq LLM** to intelligently route user inputs to relevant NLP tasks. Instead of using persistent container APIs, the orchestrator **spins up short-lived Docker containers on demand**, injects the data via environment variables, and reads the output from **stdout**.

### 🧠 What It Does

1. Accepts a `task` and `data` from the user.
2. Uses the **Groq LLM** to determine which NLP container should handle the task.
3. Runs the relevant container using `docker run --rm`, passing data as an environment variable.
4. Captures and returns the container's stdout (JSON or raw text).

---
## 🏗️ Architecture Diagram
![Architecture Diagram](https://github.com/user-attachments/assets/63293e3c-5faa-441b-a270-01e07633705a)


---
## ⚙️ Technologies Used

- **Node.js (Express)** for orchestration
- **Groq API** with `llama-3.3-70b-versatile` model for decision-making
- **Docker** for running microservices in isolated environments
- **child_process.exec** to manage and read outputs from containers

---

## 🧠 LLM Configuration

We use [Groq](https://groq.com/) as the LLM provider.

### 🔐 `.env` File

Create a `.env` file in the `orchestrator` folder:

```env
LLM_KEY=your_groq_api_key
GROQ_MODEL="llama-3.3-70b-versatile"
LLM_URL=https://api.groq.com/openai/v1/chat/completions
PORT=3050
```
Although GROQ_MODEL and LLM_URL are included in the .env file for clarity and potential future use, they are not currently referenced in the codebase.

---

## 🧩 How It Works (Flow)

1. **Client POSTs** a request to `/request` with:
   ```json
   {
     "task": "count characters",
     "data": "Hello World!"
   }
   ```
2. Orchestrator sends this `task` to Groq LLM to determine the best container.
3. Based on LLM’s response (`text_length_counter`, etc.), it runs:
   ```bash
   docker run --rm -e TEXT_TO_COUNT="Hello World!" text_length_counter
   ```
4. The container executes the script and outputs the result via `stdout`.
5. Orchestrator captures and parses the output, returning it to the client.

---

## 📦 Available Containers

Each container contains a minimal script that performs an NLP operation and prints results to stdout in JSON format.

| Container Name | Environment Variable | Task |
|---------------------------|------------------------|---------------------------|
| `text_length_counter`     | `TEXT_TO_COUNT`        | Counts number of characters in text |
| `basic_sentiment_analyzer`| `TEXT_TO_ANALYZE`      | Performs basic sentiment analysis |
| `named_entity_extractor`  | `TEXT_TO_PROCESS`      | Extracts names, locations, etc. |

---

## 🏃 Running the System

### 1. Install Dependencies (Orchestrator)

```bash
cd BioQuix_Assignment
npm install
```

### 2. Build All Docker Containers

```bash
docker build -t text_length_counter ./containers/text_length_counter
docker build -t basic_sentiment_analyzer ./containers/basic_sentiment_analyzer
docker build -t named_entity_extractor ./containers/named_entity_extractor
```

### 3. Run the Orchestrator

```bash
node orchestrator.js
```

The orchestrator server uses the **PORT** environment variable defined in the .env file to determine which port it should listen on. If PORT is not explicitly provided, it defaults to port 3000.
This behavior is controlled by the following line in `orchestrator.js`:
```bash
const port = process.env.PORT || 3000;
```

---

## 📬 Sample API Request

```bash
curl -X POST http://localhost:3000/request \
  -H "Content-Type: application/json" \
  -d '{"task":"analyze sentiment", "data":"I love AI!"}'
```

📥 **LLM maps** → `basic_sentiment_analyzer`  
🐳 **Orchestrator runs**:
```bash
docker run --rm -e TEXT_TO_ANALYZE="I love AI!" basic_sentiment_analyzer
```

📤 **Returns:**
```json
{
  "result": {
    "sentiment": "positive",
    "score":0.625  
  }
}
```

---

## 📁 Folder Structure

```
BioQuix_Assignment/
├── containers/
│   ├── text_length_counter/
│   ├── basic_sentiment_analyzer/
│   └── named_entity_extractor/
├── controllers/
│   └── process_request.js
├── routes/
│   └── request_handler.js
├── services/
│   └── llm_service.js
├── orchestrator.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
```
