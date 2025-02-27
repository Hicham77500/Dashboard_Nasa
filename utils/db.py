from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("La variable d'environnement MONGO_URI est manquante")

def connect_to_mongodb(db_name):
    client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
    return client[db_name]

def insert_asteroid_data(db, collection_name, data):
    collection = db[collection_name]

    for asteroid in data:
        if not collection.find_one({"id": asteroid["id"]}):  # Évite les doublons
            collection.insert_one(asteroid)