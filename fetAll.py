import requests
import datetime
import time
from utils.db import connect_to_mongodb
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Connexion MongoDB
db = connect_to_mongodb("AsteroidDb")
asteroids_collection = db["asteroids"]

# Clé API NASA
NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"
if not NASA_API_KEY:
    raise ValueError("La variable d'environnement NASA_API_KEY est manquante")

def fetch_all_asteroids(start_year=2020, end_year=datetime.date.today().year):
    """ Récupère TOUS les astéroïdes connus en parcourant les années """
    for year in range(start_year, end_year + 1):
        for month in range(1, 13):  # Parcourt chaque mois de l'année
            start_date = f"{year}-{month:02d}-01"
            end_date = f"{year}-{month:02d}-6"  # Pour éviter les erreurs avec février

            print(f"📡 Récupération des astéroïdes de {start_date} à {end_date}...")

            url = f"{NASA_API_URL}?start_date={start_date}&end_date={end_date}&api_key={NASA_API_KEY}"
            response = requests.get(url)
            
            if response.status_code != 200:
                print(f"⚠ Erreur API pour {start_date} - {end_date}: {response.status_code}")
                time.sleep(5)  # Pause en cas d'erreur et on réessaie
                continue

            data = response.json()

            if "near_earth_objects" in data:
                asteroid_list = []
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

                        if not asteroids_collection.find_one({"id": asteroid["id"]}):  # Évite les doublons
                            asteroid_list.append(asteroid_data)

                if asteroid_list:
                    asteroids_collection.insert_many(asteroid_list)
                    print(f"✅ {len(asteroid_list)} nouveaux astéroïdes ajoutés pour {start_date} - {end_date}")

            # Ajout d'une pause pour éviter d'être bloqué par la NASA
            time.sleep(2)  # Pause de 2 secondes entre chaque requête

    print("🚀 Récupération terminée ! TOUS les astéroïdes connus ont été stockés.")

if __name__ == "__main__":
    fetch_all_asteroids()