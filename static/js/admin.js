document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("addAsteroidForm");
    const tableBody = document.getElementById("asteroidTable");
    const searchInput = document.getElementById("searchAsteroid");
    const searchButton = document.getElementById("searchButton");
    const lastUpdateElement = document.getElementById("lastUpdate");
    const lastUpdateFooter = document.getElementById("lastUpdateFooter");
    const filterLast7DaysButton = document.getElementById("filterLast7Days");
    const paginationContainer = document.getElementById("pagination");
    let nextUpdateTimer = document.getElementById("nextUpdateTimer");

    let allAsteroids = [];
    let currentPage = 1;
    const asteroidsPerPage = 10;

    /** 🛰️ Récupération des astéroïdes **/
    function fetchAsteroids() {
        fetch("/api/asteroids")
            .then((res) => res.json())
            .then((data) => {
                allAsteroids = data;
                updateTable();
                updateLastUpdate();
            })
            .catch((err) => console.error("❌ Erreur chargement astéroïdes :", err));
    }

    /** 📊 Mise à jour du tableau **/
    function updateTable(filteredData = null) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        const dataToDisplay = filteredData && filteredData.length ? filteredData : allAsteroids;

        if (dataToDisplay.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">⚠ Aucun astéroïde trouvé</td></tr>`;
            return;
        }

        const startIndex = (currentPage - 1) * asteroidsPerPage;
        const paginatedAsteroids = dataToDisplay.slice(startIndex, startIndex + asteroidsPerPage);

        paginatedAsteroids.forEach((ast) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${ast.name}</td>
                <td>${ast.size_max}</td>
                <td>${ast.velocity}</td>
                <td>${ast.distance}</td>
                <td><button class="delete-btn" data-name="${ast.name}">🗑</button></td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", function () {
                deleteAsteroid(this.dataset.name);
            });
        });

        updatePagination(dataToDisplay.length);
    }

    /** 📅 Mise à jour de la date **/
    function updateLastUpdate() {
        if (!lastUpdateElement || !lastUpdateFooter) return;
        const now = new Date();
        const formattedDate = now.toLocaleString("fr-FR");

        lastUpdateElement.innerHTML = `📅 Dernière mise à jour : ${formattedDate}`;
        if (lastUpdateFooter.innerHTML === "--") {
            lastUpdateFooter.innerHTML = `📅 ${formattedDate}`;
        }

        localStorage.setItem("lastUpdate", formattedDate);
        calculateNextUpdate();
    }

    const savedDate = localStorage.getItem("lastUpdate");
    if (savedDate && lastUpdateFooter) {
        lastUpdateFooter.innerHTML = `📅 ${savedDate}`;
    }

    /** 🗑 Suppression d'un astéroïde **/
    function deleteAsteroid(name) {
        fetch(`/api/asteroids/${name}`, { method: "DELETE" })
            .then((res) => res.json())
            .then(() => fetchAsteroids());
    }

    /** 🔎 Filtrage des astéroïdes **/
function filterAsteroids() {
    if (!searchInput || !searchInput.value.trim()) {
        console.warn("❌ Champ de recherche vide !");
        updateTable(allAsteroids);  // Afficher tous les astéroïdes si champ vide
        return;
    }

    const searchValue = searchInput.value.toLowerCase();
    const filteredData = allAsteroids.filter((ast) => {
        return ast.name.toLowerCase().includes(searchValue);
    });

    console.log("🔍 Astéroïdes filtrés :", filteredData);

    if (filteredData.length === 0) {
        console.warn("⚠ Aucun astéroïde trouvé !");
        tableBody.innerHTML = `<tr><td colspan="5">⚠ Aucun astéroïde trouvé</td></tr>`;
    } else {
        updateTable(filteredData);
    }
}

/** 📌 Ajout des Event Listeners **/
if (searchInput && searchButton) {
    searchButton.addEventListener("click", filterAsteroids);
    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            filterAsteroids();
        }
    });
}

    /** 📅 Filtrage des 7 derniers jours **/
    function filterLast7Days() {
        if (!allAsteroids.length) {
            console.error("❌ Erreur : Aucun astéroïde disponible !");
            return;
        }

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const filteredData = allAsteroids.filter((ast) => {
            if (!ast.date) return false;
            const asteroidDate = new Date(ast.date);
            return asteroidDate >= sevenDaysAgo;
        });

        console.log("🔍 Astéroïdes filtrés :", filteredData);

        if (!filteredData.length) {
            console.warn("⚠ Aucun astéroïde trouvé pour les 7 derniers jours !");
        }

        updateTable(filteredData);
    }

    /** 📜 Mise à jour de la pagination **/
    function updatePagination(totalItems) {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(totalItems / asteroidsPerPage);
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) return;

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            paginationContainer.innerHTML += `<button class="page-btn ${
                i === currentPage ? "active" : ""
            }" data-page="${i}">${i}</button>`;
        }

        document.querySelectorAll(".page-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                currentPage = parseInt(this.dataset.page);
                updateTable();
            });
        });
    }

    /** ⏳ Correction de nextUpdateTimer **/
    function calculateNextUpdate() {
        nextUpdateTimer = document.getElementById("nextUpdateTimer");
        if (!nextUpdateTimer) {
            console.error("❌ Erreur : Élément nextUpdateTimer introuvable !");
            return;
        }

        let lastUpdateTime = localStorage.getItem("lastUpdate");
        if (!lastUpdateTime || isNaN(new Date(lastUpdateTime).getTime())) {
            nextUpdateTimer.innerHTML = "📡 En attente de la première mise à jour...";
            return;
        }

        let lastUpdateDate = new Date(lastUpdateTime);
        let nextUpdateDate = new Date(lastUpdateDate);
        nextUpdateDate.setHours(nextUpdateDate.getHours() + 24);

        function updateTimer() {
            let now = new Date();
            let timeDiff = nextUpdateDate - now;

            if (timeDiff <= 0) {
                nextUpdateTimer.innerHTML = "📡 Mise à jour en cours...";
                return;
            }

            let hours = Math.floor(timeDiff / (1000 * 60 * 60));
            let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                nextUpdateTimer.innerHTML = "📡 En attente de la première mise à jour...";
                return;
            }

            nextUpdateTimer.innerHTML = `⏳ ${hours}h ${minutes}m ${seconds}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    /** 📌 Ajout des Event Listeners **/
    if (searchInput && searchButton) {
        searchButton.addEventListener("click", filterAsteroids);
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                filterAsteroids();
            }
        });
    }

    if (filterLast7DaysButton) {
        filterLast7DaysButton.addEventListener("click", filterLast7Days);
    }

    fetchAsteroids();
});