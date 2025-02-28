document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Chargement du script principal...");

    const distanceChartCtx = document.getElementById("distanceChart").getContext("2d");
    const velocityChartCtx = document.getElementById("velocityChart").getContext("2d");
    const dateFilter = document.getElementById("dateFilter");

    let distanceChart, velocityChart;
    let allAsteroids = [];  // Stocker toutes les données pour filtrage

    function updateCharts(data) {
        // Trier par distance croissante pour afficher les plus proches
        const sortedData = data.sort((a, b) => a.distance - b.distance).slice(0, 10);
    
        const labels = sortedData.map(asteroid => asteroid.name);
        const distances = sortedData.map(asteroid => parseFloat(asteroid.distance));
        const velocities = sortedData.map(asteroid => parseFloat(asteroid.velocity));
    
        // 🔄 Supprimer les anciens graphiques
        if (distanceChart) distanceChart.destroy();
        if (velocityChart) velocityChart.destroy();
    
        // 📊 Création du graphique des distances
        distanceChart = new Chart(distanceChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "Distance en millions de km 🌍",
                    data: distances.map(d => (d / 1000000).toFixed(2)), // Convertir en millions de km
                    backgroundColor: "rgba(0, 255, 234, 0.5)",
                    borderColor: "rgba(0, 255, 234, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: "#64ffda" }, title: { display: true, text: "Nom des Astéroïdes" } },
                    y: { ticks: { color: "#64ffda" }, title: { display: true, text: "Distance (millions de km)" } }
                },
                plugins: {
                    legend: { labels: { color: "#64ffda" } },
                    tooltip: { callbacks: { label: function (context) { return `${context.raw} millions de km`; } } }
                }
            }
        });
    
        // 📊 Création du graphique des vitesses
        velocityChart = new Chart(velocityChartCtx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Vitesse en km/s 🚀",
                    data: velocities.map(v => v.toFixed(2)), // Arrondi
                    borderColor: "#00ccbb",
                    backgroundColor: "rgba(0, 204, 187, 0.3)",
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: "#64ffda" }, title: { display: true, text: "Nom des Astéroïdes" } },
                    y: { ticks: { color: "#64ffda" }, title: { display: true, text: "Vitesse (km/s)" } }
                },
                plugins: {
                    legend: { labels: { color: "#64ffda" } },
                    tooltip: { callbacks: { label: function (context) { return `${context.raw} km/s`; } } }
                }
            }
        });
    
        console.log("📊 Graphiques mis à jour !");
    }

    function filterAsteroidsByDate(startDate) {
        const filteredData = allAsteroids.filter(asteroid => {
            const asteroidDate = new Date(asteroid.date);
            return asteroidDate >= new Date(startDate);
        });
        updateCharts(filteredData);
    }

    function fetchAsteroids() {
        console.log("📡 Récupération des données des astéroïdes...");
        fetch("/api/asteroids")
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("⚠️ Erreur : données invalides reçues", data);
                    return;
                }
                allAsteroids = data;
                updateCharts(data);
            })
            .catch(error => console.error("❌ Erreur lors du chargement des astéroïdes :", error));
    }

    // 🎛 Ajouter un filtre par date
    document.getElementById("filterButton").addEventListener("click", function () {
        const selectedDate = dateFilter.value;
        if (selectedDate) {
            filterAsteroidsByDate(selectedDate);
        } else {
            alert("📅 Veuillez sélectionner une date avant de filtrer.");
        }
    });

    // 📥 Charger les données au démarrage
    fetchAsteroids();

    console.log("✅ Script chargé avec succès !");
});