from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from bson import json_util
import requests
import datetime
from apscheduler.schedulers.background import BackgroundScheduler

# Chargement des variables d'environnement
load_dotenv()

# Initialisation de Flask
app = Flask(__name__)

# Connexion à MongoDB via variable d'environnement
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("La variable d'environnement MONGO_URI est manquante")

client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client["AsteroidDb"]
asteroids_collection = db["asteroids"]

# Clé API NASA
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
                    asteroids_collection.insert_one(asteroid_data)
    print("Mise à jour des astéroïdes terminée !")

# Route pour ajouter uniquement les nouvelles données
@app.route("/fetch_new_asteroids", methods=["GET"])
def fetch_new_asteroids():
    fetch_asteroids()
    return jsonify({"message": "Nouvelles données insérées avec succès !"})

# Route pour récupérer les astéroïdes avec filtres
@app.route('/asteroids', methods=['GET'])
def get_asteroids():
    filter_type = request.args.get('filter', 'closest')  # Par défaut : plus proches

    if filter_type == "closest":
        # Astéroïdes les plus proches
        pipeline = [{"$sort": {"distance": 1}}, {"$limit": 10}]
    elif filter_type == "largest":
        # Astéroïdes les plus grands
        pipeline = [{"$sort": {"size_max": -1}}, {"$limit": 10}]
    elif filter_type == "dangerous":
        # Astéroïdes dangereux (distance < 5M km et vitesse > 10 km/s)
        pipeline = [
            {"$match": {"distance": {"$lt": 5000000}, "velocity": {"$gt": 10000}}},
            {"$limit": 10}
        ]
    else:
        return jsonify({"error": "Filtre invalide"}), 400

    asteroids_data = list(asteroids_collection.aggregate(pipeline))
    return jsonify(json.loads(json_util.dumps(asteroids_data)))

# Planification du refresh toutes les 30 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_asteroids, "interval", minutes=30)
scheduler.start()

# Route d'accueil
@app.route('/')
def index():
    return render_template('index.html')

# Lancer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)