from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import os

app = Flask(__name__)
CORS(app)

stats = {
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "total": 0
}

@app.route("/")
def home():
    return jsonify({"message": "Sentiment Analyzer Backend is Running"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "positive"
        stats["positive"] += 1
    elif polarity < -0.1:
        sentiment = "negative"
        stats["negative"] += 1
    else:
        sentiment = "neutral"
        stats["neutral"] += 1

    stats["total"] += 1
    return jsonify({"sentiment": sentiment})

@app.route("/stats", methods=["GET"])
def get_stats():
    return jsonify(stats)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)