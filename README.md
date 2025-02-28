🌌 Asteroid Tracker 🚀

Suivi en temps réel des astéroïdes proches de la Terre grâce à l’API NASA.

📌 Description du projet

Ce projet permet de visualiser, filtrer, et analyser les astéroïdes détectés par la NASA en fonction de divers critères :
	•	Distance de la Terre
	•	Taille maximale
	•	Vitesse
	•	Potentiel danger

🏗 Technologies utilisées

Backend
	•	Flask : API REST
	•	MongoDB : Base de données NoSQL pour stocker les astéroïdes
	•	PyMongo : Connexion entre Flask et MongoDB
	•	Requests : Requêtes HTTP vers l’API NASA

Frontend
	•	Bootstrap : Interface moderne et responsive
	•	JavaScript : Dynamisation de l’interface
	•	Chart.js : Visualisation des données

✅ Installation et configuration

1️⃣ Prérequis
	•	Python 3.x
	•	MongoDB (local ou cloud, ex : MongoDB Atlas)
	•	Clé API NASA (Créer un compte sur api.nasa.gov)

2️⃣ Cloner le projet

git clone https://github.com/Hicham77500/Dashboard_Nasa
cd asteroid-tracker

3️⃣ Créer un environnement virtuel et installer les dépendances

python -m venv venv
source venv/bin/activate  # Sur Mac/Linux
venv\Scripts\activate  # Sur Windows

pip install -r requirements.txt

4️⃣ Configurer les variables d’environnement

Créer un fichier .env et y ajouter :

MONGO_URI="mongodb+srv://votre-utilisateur:votre-motdepasse@cluster.mongodb.net/AsteroidDb"
NASA_API_KEY="votre_cle_api_nasa"

5️⃣ Lancer l’application

python app.py

L’application sera accessible sur http://127.0.0.1:5000.

🔗 Structure du projet

📂 Projet_Nasa/
│── 📁 static/          # Fichiers CSS, JS et images
│── 📁 templates/       # Pages HTML Flask (index, admin, details)
│── 📁 data/            # Données récupérées
│── 📄 app.py           # Application Flask
│── 📄 db.py            # Connexion MongoDB
│── 📄 fetchAteroids.py # Script de récupération NASA
│── 📄 requirements.txt # Dépendances Python
│── 📄 .env             # Variables d'environnement (MONGO_URI, NASA_API_KEY)

📊 Tableau de bord et fonctionnalités

🌠 Gestion des Astéroïdes

✔ Affichage des astéroïdes récupérés via l’API NASA
✔ Stockage en MongoDB
✔ Recherche par nom

📊 Filtres dynamiques

✔ Trier par taille, vitesse, dangerosité
✔ Sélection des 7 derniers jours
✔ Alertes visuelles pour les astéroïdes dangereux

🗑 Gestion des données

✔ Ajout manuel d’un astéroïde
✔ Suppression d’un astéroïde

🎯 Améliorations futures

🔹 Ajouter une carte interactive des trajectoires
🔹 Notifications pour les astéroïdes dangereux
🔹 Intégration WebSockets pour un suivi en temps réel

📜 Licence

Projet sous licence MIT – Développé par Hicham Guendouz, Ilyas Maalal, Boussad Ait Djoudi Oufella.

Ce README.md contient tout ce qu’il faut pour installer, configurer et exécuter le projet sur une autre machine.

Si vous souhaitez le télécharger en tant que fichier, dites-moi et je le générerai pour vous ! 🚀 ￼