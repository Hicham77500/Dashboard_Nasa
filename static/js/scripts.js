// scripts.js

// Fonction pour filtrer les astéroïdes
function filterAsteroids(filterType) {
    fetch(`/asteroids?filter=${filterType}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#asteroids-table tbody");
            tableBody.innerHTML = ""; // Effacer le contenu actuel

            data.forEach(asteroid => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${asteroid.name}</td>
                    <td>${asteroid.estimated_diameter.kilometers.estimated_diameter_max}</td>
                    <td>${asteroid.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                    <td>${asteroid.close_approach_data[0].miss_distance.kilometers}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Erreur :", error));
}

// Charger les données initiales au chargement de la page
window.onload = () => filterAsteroids("closest");

let barChart, radarChart; // Variables pour stocker les graphiques

// Fonction pour filtrer les astéroïdes
function filterAsteroids(filterType) {
    fetch(`/asteroids?filter=${filterType}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#asteroids-table tbody");
            tableBody.innerHTML = ""; // Effacer le contenu actuel

            // Mettre à jour le tableau
            data.forEach(asteroid => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${asteroid.name}</td>
                    <td>${asteroid.estimated_diameter.kilometers.estimated_diameter_max}</td>
                    <td>${asteroid.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                    <td>${asteroid.close_approach_data[0].miss_distance.kilometers}</td>
                `;
                tableBody.appendChild(row);
            });

            // Mettre à jour les graphiques
            updateCharts(data);
        })
        .catch(error => console.error("Erreur :", error));
}

// Fonction pour mettre à jour les graphiques
function updateCharts(data) {
    const labels = data.map(asteroid => asteroid.name);
    const distances = data.map(asteroid => asteroid.close_approach_data[0].miss_distance.kilometers);
    const speeds = data.map(asteroid => asteroid.close_approach_data[0].relative_velocity.kilometers_per_second);
    const diameters = data.map(asteroid => asteroid.estimated_diameter.kilometers.estimated_diameter_max);

    // Graphique en barres (distance)
    if (barChart) barChart.destroy();
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distance (km)',
                data: distances,
                backgroundColor: 'rgba(0, 255, 234, 0.6)',
                borderColor: 'rgba(0, 255, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Couleur des étiquettes de l'axe X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe X
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Couleur des étiquettes de l'axe Y
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe Y
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Couleur de la légende
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    showAsteroidDetails(data[index]);
                }
            }
        }
    });

    // Graphique en radar (caractéristiques)
    if (radarChart) radarChart.destroy();
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Distance', 'Vitesse', 'Diamètre'],
            datasets: [{
                label: 'Caractéristiques',
                data: [distances[0], speeds[0], diameters[0]], // Exemple pour le premier astéroïde
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes d'angle
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille
                    },
                    pointLabels: {
                        color: 'white' // Couleur des étiquettes des points
                    },
                    ticks: {
                        color: 'white' // Couleur des étiquettes des ticks
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Couleur de la légende
                    }
                }
            }
        }
    });
}

// Fonction pour filtrer les astéroïdes
function filterAsteroids(filterType) {
    fetch(`/asteroids?filter=${filterType}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#asteroids-table tbody");
            tableBody.innerHTML = ""; // Effacer le contenu actuel

            // Mettre à jour le tableau
            data.forEach(asteroid => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${asteroid.name}</td>
                    <td>${asteroid.estimated_diameter.kilometers.estimated_diameter_max}</td>
                    <td>${asteroid.close_approach_data[0].relative_velocity.kilometers_per_second}</td>
                    <td>${asteroid.close_approach_data[0].miss_distance.kilometers}</td>
                `;
                tableBody.appendChild(row);
            });

            // Mettre à jour les graphiques
            updateCharts(data);
        })
        .catch(error => console.error("Erreur :", error));
}

// Fonction pour mettre à jour les graphiques
function updateCharts(data) {
    const labels = data.map(asteroid => asteroid.name);
    const distances = data.map(asteroid => asteroid.close_approach_data[0].miss_distance.kilometers);
    const speeds = data.map(asteroid => asteroid.close_approach_data[0].relative_velocity.kilometers_per_second);
    const diameters = data.map(asteroid => asteroid.estimated_diameter.kilometers.estimated_diameter_max);

    // Graphique en barres (distance)
    if (barChart) barChart.destroy();
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distance (km)',
                data: distances,
                backgroundColor: 'rgba(0, 255, 234, 0.6)',
                borderColor: 'rgba(0, 255, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white' // Couleur des étiquettes de l'axe X
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe X
                    }
                },
                y: {
                    ticks: {
                        color: 'white' // Couleur des étiquettes de l'axe Y
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe Y
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Couleur de la légende
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    showAsteroidDetails(data[index]);
                }
            }
        }
    });

    // Graphique en radar (caractéristiques)
    if (radarChart) radarChart.destroy();
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Distance', 'Vitesse', 'Diamètre'],
            datasets: [{
                label: 'Caractéristiques',
                data: [distances[0], speeds[0], diameters[0]], // Exemple pour le premier astéroïde
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur des lignes d'angle
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille
                    },
                    pointLabels: {
                        color: 'white' // Couleur des étiquettes des points
                    },
                    ticks: {
                        color: 'white' // Couleur des étiquettes des ticks
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Couleur de la légende
                    }
                }
            }
        }
    });
}

// Fonction pour afficher les détails de l'astéroïde dans une boîte modale
function showAsteroidDetails(asteroid) {
    const modal = document.getElementById('asteroidModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <p><strong>Nom :</strong> ${asteroid.name}</p>
        <p><strong>Diamètre :</strong> ${asteroid.estimated_diameter.kilometers.estimated_diameter_max} km</p>
        <p><strong>Vitesse :</strong> ${asteroid.close_approach_data[0].relative_velocity.kilometers_per_second} km/s</p>
        <p><strong>Distance :</strong> ${asteroid.close_approach_data[0].miss_distance.kilometers} km</p>
    `;
    modal.style.display = "block";
}

// Fermer la boîte modale
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('asteroidModal').style.display = "none";
});

// Charger les données initiales au chargement de la page
window.onload = () => filterAsteroids("closest");