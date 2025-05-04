import os
from textblob import TextBlob 

text_to_analyze = os.environ.get("TEXT_TO_ANALYZE")

if text_to_analyze:
    analysis = TextBlob(text_to_analyze)
    sentiment = analysis.sentiment.polarity
    if sentiment > 0:
        print(f'{{"sentiment": "positive", "score": {sentiment}}}')
    elif sentiment < 0:
        print(f'{{"sentiment": "negative", "score": {sentiment}}}')
    else:
        print(f'{{"sentiment": "neutral", "score": {sentiment}}}')
else:
    print("Error: TEXT_TO_ANALYZE environment variable not set.")