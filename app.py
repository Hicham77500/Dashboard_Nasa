from flask import Flask, jsonify, render_template, request
from utils.nasa_api import get_asteroid_data
from utils.db import connect_to_mongodb, insert_asteroid_data
from bson import json_util
import json

app = Flask(__name__)

@app.route('/asteroids', methods=['GET'])
def get_asteroids():
    filter_type = request.args.get('filter', 'closest')  # Par défaut : plus proches
    db = connect_to_mongodb("mongodb://localhost:27017/", "nasa")

    if filter_type == "closest":
        # Astéroïdes les plus proches
        pipeline = [
            {"$sort": {"close_approach_data.miss_distance.kilometers": 1}},
            {"$limit": 10}
        ]
    elif filter_type == "largest":
        # Astéroïdes les plus grands
        pipeline = [
            {"$sort": {"estimated_diameter.kilometers.estimated_diameter_max": -1}},
            {"$limit": 10}
        ]
    elif filter_type == "dangerous":
        # Astéroïdes dangereux (distance < X et vitesse > Y)
        pipeline = [
            {"$match": {
                "close_approach_data.miss_distance.kilometers": {"$lt": 5000000},
                "close_approach_data.relative_velocity.kilometers_per_second": {"$gt": 10}
            }},
            {"$limit": 10}
        ]
    else:
        return jsonify({"error": "Filtre invalide"}), 400

    asteroids_data = list(db.asteroids.aggregate(pipeline))
    asteroids_data = json.loads(json_util.dumps(asteroids_data))
    return jsonify(asteroids_data)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)