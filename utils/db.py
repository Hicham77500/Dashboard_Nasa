from pymongo import MongoClient

def connect_to_mongodb(uri, db_name):
    client = MongoClient(uri)
    db = client[db_name]
    return db

def insert_asteroid_data(db, collection_name, data):
    collection = db[collection_name]
    collection.insert_many(data)