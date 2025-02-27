import requests

def get_asteroid_data(api_key):
    url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'near_earth_objects' in data:
            return data
        else:
            raise ValueError("La clé 'near_earth_objects' est manquante dans la réponse de l'API.")
    else:
        raise Exception(f"Erreur API : {response.status_code} - {response.text}")