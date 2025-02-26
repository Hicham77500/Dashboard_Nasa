from flask import Flask, jsonify, render_template
import requests
import pymongo
from datetime import datetime

app = Flask(__name__)

# Configuration MongoDB --------------------------------------------------- decider de qui doit gerer la base de données
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["asteroid_dashboard"]
asteroids_collection = db["asteroids"]

# API NASA - Remplace "DEMO_KEY" par ta propre clé API ------------------- 
NASA_API_KEY = "DEMO_KEY"
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed?start_date={}&api_key={}" 

# Récupération des astéroïdes et stockage en MongoDB ------ aussi pour la personne qui devras voir les données
@app.route('/fetch_asteroids', methods=['GET'])
def fetch_asteroids():
    today = datetime.today().strftime('%Y-%m-%d')
    url = NASA_API_URL.format(today, NASA_API_KEY)
    response = requests.get(url)
    data = response.json()
    
    if "near_earth_objects" in data:
        for date in data["near_earth_objects"]:
            for asteroid in data["near_earth_objects"][date]:
                asteroid["date"] = date
                asteroids_collection.insert_one(asteroid)
    
    return jsonify({"message": "Données des astéroïdes enregistrées"})

# Endpoint pour récupérer les astéroïdes stockés--------------- postman pour tester
@app.route('/asteroids', methods=['GET'])
def get_asteroids():
    asteroids = list(asteroids_collection.find({}, {"_id": 0}))
    return jsonify(asteroids)

# Page d'accueil (Affichage des données en HTML) -------- pour la personne qui devras voir les données
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)


