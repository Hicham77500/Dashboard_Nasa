import requests
import datetime
from dotenv import load_dotenv
import os

load_dotenv()
NASA_API_KEY = os.getenv("NASA_API_KEY")
NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed"

start_date = datetime.date.today().strftime("%Y-%m-%d")
url = f"{NASA_API_URL}?start_date={start_date}&api_key={NASA_API_KEY}"

response = requests.get(url)
data = response.json()

print(f"Nombre total d'astéroïdes récupérés : {sum(len(v) for v in data['near_earth_objects'].values())}")