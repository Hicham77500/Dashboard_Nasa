import os
from pymongo import MongoClient
from flask import Flask, jsonify

app = Flask(__name__)

MONGO_URI = os.getenv("MONGO_URI")  # Vérifiez que votre .env est bien chargé
client = MongoClient(MONGO_URI)
try:
    client.admin.command('ping')
    print("Connexion réussie à MongoDB ! ✅")
except Exception as e:
    print(f"Erreur de connexion : {e}")


db = client["AsteroidDb"]
asteroids_collection = db["asteroids"]

# API NASA
NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"


@app.route("/asteroids", methods=["GET"])
def get_asteroids():
    asteroids = list(asteroids_collection.find({}, {"_id": 0}))
    return jsonify(asteroids)


# Lancer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)