# 🌍 Dashboard des Astéroïdes - NASA API 🚀

## 📌 Description
Ce projet est un **Dashboard interactif** qui permet de suivre en **temps réel** les astéroïdes proches de la Terre grâce à l'API NeoWs de la NASA. Il stocke les données dans **MongoDB** et les affiche via une interface dynamique en **Flask + Bootstrap**.

## 🛠 Technologies Utilisées
- **Backend :** Flask (Python) + PyMongo
- **Base de données :** MongoDB
- **Frontend :** Bootstrap (HTML/CSS)
- **Données :** API NASA NeoWs (Near Earth Object Web Service)
- **JS Optionnel :** Alpine.js / Vue.js (filtres dynamiques, alertes)

## 🚀 Fonctionnalités
- 🔍 **Affichage en temps réel** des astéroïdes proches de la Terre
- 🗄 **Stockage MongoDB** pour conserver l'historique des passages
- 📊 **Carte interactive** permettant de visualiser les trajectoires
- ⚠️ **Alerte automatique** en cas de passage d’un gros astéroïde
- 📆 **Filtrage avancé** par taille, vitesse et dangerosité

## 🔧 Installation et Lancement
1️⃣ **Cloner le dépôt :**
```bash
git clone https://github.com/votre-repo/Dashboard_Nasa.git
cd Dashboard_Nasa
```
2️⃣ **Créer un environnement virtuel (optionnel) :**
```bash
python -m venv venv
source venv/bin/activate  # Sur macOS/Linux
venv\Scripts\activate     # Sur Windows
```
3️⃣ **Installer les dépendances :**
```bash
pip install -r requirements.txt
```
4️⃣ **Lancer MongoDB et Configurer l’API NASA :**
- Démarrer **MongoDB** (`mongod` en local ou utiliser MongoDB Atlas).
- Obtenir une clé API sur [NASA API](https://api.nasa.gov/) et la renseigner dans `app.py` :
```python
NASA_API_KEY = "VOTRE_CLE_API"
```
5️⃣ **Démarrer l'application Flask :**
```bash
python app.py
```
Accédez à **http://127.0.0.1:5000/** 🚀

## 📜 Licence
Ce projet est sous licence **MIT**, ce qui permet une utilisation libre tout en mentionnant les auteurs.


# 📂 Structure du projet - Dashboard des Astéroïdes 🚀

Ce projet est organisé pour assurer une séparation claire entre le **Backend (Flask + MongoDB)** et le **Frontend (Bootstrap + JS optionnel)**.

---

## 📁 Arborescence du projet
```
/Projet_NASA
│-- /static              # Fichiers statiques (CSS, JS, images)
│   ├── /css             # Styles CSS pour le front-end
│   ├── /js              # Scripts JS (Alpine.js ou Vue.js)
│   ├── /images          # Images et icônes
│-- /templates           # Fichiers HTML pour le rendu Flask
│   ├── index.html       # Page principale affichant les astéroïdes
│-- /data                # Stockage temporaire des données JSON (optionnel)
│-- /utils               # Fichiers utilitaires (gestion des requêtes API...)
│   ├── nasa_api.py      # Fonction pour récupérer les données de l'API NASA
│   ├── db.py            # Connexion et gestion de MongoDB
│-- app.py               # Fichier principal pour lancer Flask
│-- config.py            # Variables de configuration (clé API, MongoDB...)
│-- requirements.txt     # Liste des dépendances du projet
│-- README.md            # Documentation du projet
│-- .gitignore           # Fichiers à exclure du dépôt Git
```

