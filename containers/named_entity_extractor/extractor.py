import os
import spacy
import json

text_to_process = os.environ.get("TEXT_TO_PROCESS")

if not text_to_process:
    print("Error: TEXT_TO_PROCESS environment variable not set.")
    exit(1)

# Load small English model
nlp = spacy.load("en_core_web_sm")
doc = nlp(text_to_process)

entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]

print(json.dumps({"entities": entities}))