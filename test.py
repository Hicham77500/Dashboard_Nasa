import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")  # Vérifiez que votre .env est bien chargé
client = MongoClient(MONGO_URI)
try:
    client.admin.command('ping')
    print("Connexion réussie à MongoDB ! ✅")
except Exception as e:
    print(f"Erreur de connexion : {e}")