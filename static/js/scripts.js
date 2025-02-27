// script.js

let barChart, radarChart; // Variables pour stocker les graphiques

// Fonction pour filtrer les astéroïdes
function filterAsteroids(filterType) {
    fetch(`/asteroids?filter=${filterType}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            updateCharts(data);
        })
        .catch(error => console.error("Erreur :", error));
}

// Fonction pour mettre à jour le tableau
function updateTable(data) {
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
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
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
            datasets: data.map((asteroid, index) => ({
                label: asteroid.name,
                data: [
                    distances[index],
                    speeds[index],
                    diameters[index]
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }))
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    pointLabels: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// Charger les données initiales au chargement de la page
window.onload = () => filterAsteroids("closest");
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const ctx = document.getElementById('distanceChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['0-1M km', '1M-2M km', '2M-3M km', '3M-4M km', '4M-5M km'],
        datasets: [{
            label: 'Nombre d\'astéroïdes',
            data: [5, 12, 8, 4, 3], // Remplacez par vos données dynamiques
            backgroundColor: 'rgba(0, 255, 234, 0.5)',
            borderColor: '#00ffea',
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
                    color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe X (optionnel)
                }
            },
            y: {
                ticks: {
                    color: 'white' // Couleur des étiquettes de l'axe Y
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe Y (optionnel)
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
        }
    }
});
//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ctx2 = document.getElementById('diameterChart').getContext('2d');
new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['< 100 m', '100 m - 500 m', '> 500 m'],
        datasets: [{
            label: 'Taille des astéroïdes',
            data: [10, 15, 5], // Remplacez par vos données dynamiques
            backgroundColor: [
                'rgba(0, 255, 150, 0.7)',
                'rgba(0, 200, 200, 0.7)',
                'rgba(0, 150, 255, 0.7)'
            ],
            borderColor: '#000',
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Couleur de la légende en blanc
                }
            }
        }
    }
});

//  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ctx3 = document.getElementById('velocityChart').getContext('2d');
new Chart(ctx3, {
    type: 'line',
    data: {
        labels: ['Astéroïde 1', 'Astéroïde 2', 'Astéroïde 3', 'Astéroïde 4', 'Astéroïde 5'],
        datasets: [{
            label: 'Vitesse relative (km/s)',
            data: [20, 15, 30, 25, 18], // Remplacez par vos données dynamiques
            borderColor: '#00ccbb',
            backgroundColor: 'rgba(0, 204, 187, 0.3)',
            borderWidth: 2,
            tension: 0.4
        }]
    },
    options: {
        scales: {
            x: {
                ticks: {
                    color: 'white' // Couleur des étiquettes de l'axe X en blanc
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe X (optionnel)
                }
            },
            y: {
                ticks: {
                    color: 'white' // Couleur des étiquettes de l'axe Y en blanc
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Couleur de la grille de l'axe Y (optionnel)
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Couleur de la légende en blanc
                }
            }
        }
    }
});