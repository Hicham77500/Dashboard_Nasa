from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Initialiser Flask
app = Flask(__name__)

# Connexion à MongoDB
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("La variable d'environnement MONGO_URI est manquante")

client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client["AsteroidDb"]
asteroids_collection = db["asteroids"]

# Routes principales
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    return render_template("admin.html")

# API CRUD MongoDB
@app.route("/api/asteroids", methods=["GET"])
def get_asteroids():
    asteroids = list(asteroids_collection.find({}, {"_id": 0}))
    return jsonify(asteroids)

@app.route("/api/asteroids", methods=["POST"])
def create_asteroid():
    data = request.json
    asteroids_collection.insert_one(data)
    return jsonify({"message": "Astéroïde ajouté"}), 201

@app.route("/api/asteroids/<string:name>", methods=["DELETE"])
def delete_asteroid(name):
    result = asteroids_collection.delete_one({"name": name})
    return jsonify({"message": "Astéroïde supprimé"}) if result.deleted_count else jsonify({"error": "Non trouvé"}), 404

if __name__ == "__main__":
    app.run(debug=True)