document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addAsteroidForm");
  const tableBody = document.getElementById("asteroidTable");
  const searchInput = document.getElementById("searchAsteroid");
  const searchButton = document.getElementById("searchButton");
  const lastUpdateElement = document.getElementById("lastUpdate");
  const lastUpdateFooter = document.getElementById("lastUpdateFooter");
  const filterLast7DaysButton = document.getElementById("filterLast7Days");
  const paginationContainer = document.getElementById("pagination");
  const nextUpdateTimer = document.getElementById("nextUpdateTimer");

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

    const dataToDisplay =
      filteredData && filteredData.length ? filteredData : allAsteroids;

    console.log("🛠 Mise à jour tableau avec :", dataToDisplay); // ✅ Debug

    if (dataToDisplay.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">⚠ Aucun astéroïde trouvé</td></tr>`;
      return;
    }

    const startIndex = (currentPage - 1) * asteroidsPerPage;
    const paginatedAsteroids = dataToDisplay.slice(
      startIndex,
      startIndex + asteroidsPerPage
    );

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

    // Vérifier si le footer n'a pas déjà été mis à jour
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
    if (!searchInput) return;
    const searchValue = searchInput.value.toLowerCase();
    const filteredData = allAsteroids.filter((ast) =>
      ast.name.toLowerCase().includes(searchValue)
    );
    updateTable(filteredData);
  }

  /** 📅 Filtrage des 7 derniers jours **/
  function filterLast7Days() {
    if (!allAsteroids.length) return;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const filteredData = allAsteroids.filter((ast) => {
      if (!ast.date) return false;
      const asteroidDate = new Date(ast.date);
      return asteroidDate >= sevenDaysAgo;
    });

    console.log("🔍 Astéroïdes filtrés :", filteredData); // Vérifie les données

    tableBody.innerHTML = ""; // 🛠 Force le vidage du tableau

    if (!tableBody) {
      console.error("❌ Erreur : Élément tableBody non trouvé !");
      return;
    }

    updateTable(filteredData);
    setTimeout(() => {
      tableBody.style.display = "none";
      setTimeout(() => {
        tableBody.style.display = "table-row-group";
      }, 50);
    }, 50);
    console.log("✅ Mise à jour du tableau après filtre"); // Confirme l'exécution
  }

  /** 📜 Mise à jour de la pagination **/
  function updatePagination(totalItems) {
    if (!paginationContainer) return;
    const totalPages = Math.ceil(totalItems / asteroidsPerPage);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (currentPage > 1) {
      paginationContainer.innerHTML += `<button class="page-btn" data-page="1">⏮️</button>`;
      paginationContainer.innerHTML += `<button class="page-btn" data-page="${
        currentPage - 1
      }">◀️</button>`;
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.innerHTML += `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }

    if (currentPage < totalPages) {
      paginationContainer.innerHTML += `<button class="page-btn" data-page="${
        currentPage + 1
      }">▶️</button>`;
      paginationContainer.innerHTML += `<button class="page-btn" data-page="${totalPages}">⏭️</button>`;
    }

    document.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        updateTable();
      });
    });
  }

  /** ⏳ Mise à jour du Timer **/
  function calculateNextUpdate() {
    if (!nextUpdateTimer) return;
    let lastUpdateTime = localStorage.getItem("lastUpdate");
    if (!lastUpdateTime) {
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
      } else {
        let hours = Math.floor(timeDiff / (1000 * 60 * 60));
        let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        nextUpdateTimer.innerHTML = `⏳ ${hours}h ${minutes}m ${seconds}s`;
      }
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
