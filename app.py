from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
import os
import datetime
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

# Initialisation de Flask
app = Flask(__name__)

# Connexion à MongoDB
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("La variable d'environnement MONGO_URI est manquante")

client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client["AsteroidDb"]
asteroids_collection = db["asteroids"]

# API NASA
NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"
if not NASA_API_KEY:
    raise ValueError("La variable d'environnement NASA_API_KEY est manquante")

# Fonction pour récupérer et stocker les nouveaux astéroïdes
def fetch_asteroids():
    start_date = datetime.date.today().strftime("%Y-%m-%d")
    url = f"{NASA_API_URL}?start_date={start_date}&api_key={NASA_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if "near_earth_objects" in data:
        for date in data["near_earth_objects"]:
            for asteroid in data["near_earth_objects"][date]:
                asteroid_data = {
                    "id": asteroid["id"],
                    "name": asteroid["name"],
                    "date": date,
                    "size_min": asteroid["estimated_diameter"]["meters"]["estimated_diameter_min"],
                    "size_max": asteroid["estimated_diameter"]["meters"]["estimated_diameter_max"],
                    "velocity": float(asteroid["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"]),
                    "distance": float(asteroid["close_approach_data"][0]["miss_distance"]["kilometers"]),
                    "is_hazardous": asteroid["is_potentially_hazardous_asteroid"],
                }
                if not asteroids_collection.find_one({"id": asteroid["id"]}):
                    print("Données reçues de l'API :", data)
                    asteroids_collection.insert_one(asteroid_data)
    print("Mise à jour des astéroïdes terminée !")

# Route pour ajouter uniquement les nouvelles données
@app.route("/fetch_new_asteroids", methods=["GET"])
def fetch_new_asteroids():
    fetch_asteroids()
    return jsonify({"message": "Nouvelles données insérées avec succès !"})

# Route pour récupérer les 3 astéroïdes les plus proches
@app.route("/closest_asteroids", methods=["GET"])
def get_closest_asteroids():
    asteroids = list(asteroids_collection.find({}, {"_id": 0}).sort("distance", 1).limit(3))
    return jsonify(asteroids)

# Route pour récupérer les 3 astéroïdes les plus éloignés
@app.route("/farthest_asteroids", methods=["GET"])
def get_farthest_asteroids():
    asteroids = list(asteroids_collection.find({}, {"_id": 0}).sort("distance", -1).limit(3))
    return jsonify(asteroids)

# Planification du refresh toutes les 30 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_asteroids, "interval", minutes=30)
scheduler.start()

# Lancer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)
