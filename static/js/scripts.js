let barChart, radarChart, distanceChart, diameterChart, velocityChart;
let asteroidsData = [];

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("asteroidModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.querySelector(".modal .close");

    function showAsteroidDetails(asteroid) {
        if (!asteroid) {
            console.error("Erreur : Astéroïde non trouvé !");
            return;
        }

        modalTitle.textContent = `Détails de ${asteroid.name}`;
        modalContent.innerHTML = `
            <p><strong>ID :</strong> ${asteroid.id}</p>
            <p><strong>Diamètre Max :</strong> ${asteroid.size_max.toFixed(2)} km</p>
            <p><strong>Vitesse :</strong> ${asteroid.velocity.toFixed(2)} km/s</p>
            <p><strong>Distance :</strong> ${asteroid.distance.toFixed(2)} km</p>
            <p><strong>Est dangereux ? :</strong> ${asteroid.is_hazardous ? "Oui" : "Non"}</p>
        `;

        modal.classList.add("active");
    }

    closeModal.addEventListener("click", () => modal.classList.remove("active"));
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.classList.remove("active");
    });

    function filterAsteroids(filterType) {
        fetch(`/api/asteroids?filter=${filterType}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("Données invalides reçues :", data);
                    return;
                }

                asteroidsData = data;
                updateTable(data);
                updateCharts(data);
            })
            .catch(error => console.error("Erreur lors de la récupération des astéroïdes :", error));
    }

    function updateTable(data) {
        const tableBody = document.querySelector("#asteroids-table tbody");
        tableBody.innerHTML = "";

        data.forEach((asteroid, index) => {
            const row = document.createElement("tr");
            row.dataset.index = index;
            row.innerHTML = `
                <td class="clickable">${asteroid.name}</td>
                <td>${asteroid.size_max.toFixed(2)}</td>
                <td>${asteroid.velocity.toFixed(2)}</td>
                <td>${asteroid.distance.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".clickable").forEach((td, index) => {
            td.addEventListener("click", () => showAsteroidDetails(asteroidsData[index]));
        });
    }

    function resetCharts() {
        [barChart, radarChart, distanceChart, diameterChart, velocityChart].forEach(chart => {
            if (chart) chart.destroy();
        });
    }

    function updateCharts(data) {
        const labels = data.map(asteroid => asteroid.name);
        const distances = data.map(asteroid => parseFloat(asteroid.distance));
        const speeds = data.map(asteroid => parseFloat(asteroid.velocity));
        const diameters = data.map(asteroid => parseFloat(asteroid.size_max));

        resetCharts();

        barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Distance (km)', data: distances, backgroundColor: 'rgba(0, 255, 234, 0.6)', borderColor: 'rgba(0, 255, 234, 1)', borderWidth: 1 }] },
            options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
        });

        radarChart = new Chart(document.getElementById('radarChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Distance', 'Vitesse', 'Diamètre'],
                datasets: data.map((asteroid, index) => ({
                    label: asteroid.name,
                    data: [distances[index], speeds[index], diameters[index]],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }))
            },
            options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
        });

        diameterChart = new Chart(document.getElementById('diameterChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels,
                datasets: [{ label: 'Diamètre (km)', data: diameters, backgroundColor: ['rgba(0, 255, 150, 0.7)', 'rgba(0, 200, 200, 0.7)', 'rgba(0, 150, 255, 0.7)'], borderColor: '#000', borderWidth: 1 }]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
        });

        velocityChart = new Chart(document.getElementById('velocityChart').getContext('2d'), {
            type: 'line',
            data: { labels, datasets: [{ label: 'Vitesse relative (km/s)', data: speeds, borderColor: '#00ccbb', backgroundColor: 'rgba(0, 204, 187, 0.3)', borderWidth: 2, tension: 0.4 }] },
            options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } } }
        });
    }

    filterAsteroids("closest");

    document.getElementById("filterClosest").addEventListener("click", () => filterAsteroids("closest"));
    document.getElementById("filterLargest").addEventListener("click", () => filterAsteroids("largest"));
    document.getElementById("filterDangerous").addEventListener("click", () => filterAsteroids("dangerous"));
});