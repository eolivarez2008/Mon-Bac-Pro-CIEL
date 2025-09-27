// Configuration initiale de la carte Leaflet centrée sur la France
const map = L.map('map').setView([46.603354, 1.888334], 6);

// Intégration de la couche de tuiles CartoDB Dark Matter
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Définition de l'état initial des données et de la pagination
let lyceesData = [];
let currentPage = 1;
const rowsPerPage = 20;
let currentSort = { column: null, order: 'asc' };

// Récupération des références aux éléments du DOM
const tableBody = document.getElementById("lyceesTableBody");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const toggleBtn = document.getElementById("toggleView");
const mapDiv = document.getElementById("map");
const tableDiv = document.getElementById("tableContainer");

// Gestion de la permutation entre les vues Carte et Tableau
toggleBtn.addEventListener("click", () => {
    const isMapHidden = mapDiv.classList.toggle("d-none");
    tableDiv.classList.toggle("d-none", !isMapHidden);
    document.getElementById("toggleText").textContent = isMapHidden ? "Carte" : "Liste";

    if (!isMapHidden) {
        setTimeout(() => map.invalidateSize(), 100);
    }
});

// Récupération des données et initialisation des composants
fetch('./data/lycees.json')
    .then(r => r.json())
    .then(data => {
        lyceesData = data.sort((a, b) => 
            a.codePostal.localeCompare(b.codePostal, undefined, { numeric: true })
        );

        lyceesData.forEach(lycee => {
            if (lycee.coords?.length === 2) {
                L.marker(lycee.coords)
                    .addTo(map)
                    .bindPopup(`<b>${lycee.nom}</b><br>${lycee.ville} (${lycee.codePostal})`);
            }
        });

        renderTable();
    })
    .catch(error => console.error("Erreur de chargement du JSON :", error));

// Génération du contenu du tableau avec tri et pagination
function renderTable() {
    tableBody.innerHTML = "";
    let sorted = [...lyceesData];

    if (currentSort.column) {
        sorted.sort((a, b) => {
            const valA = String(a[currentSort.column] || "").toLowerCase();
            const valB = String(b[currentSort.column] || "").toLowerCase();
            const comparison = valA.localeCompare(valB, undefined, { numeric: true });
            return currentSort.order === 'asc' ? comparison : -comparison;
        });
    }

    const start = (currentPage - 1) * rowsPerPage;
    const pageData = sorted.slice(start, start + rowsPerPage);

    pageData.forEach(lycee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${lycee.nom}</td>
            <td>${lycee.ville}</td>
            <td>${lycee.codePostal}</td>
        `;
        tableBody.appendChild(row);
    });

    const totalPages = Math.ceil(sorted.length / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Gestion des contrôles de pagination
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(lyceesData.length / rowsPerPage)) {
        currentPage++;
        renderTable();
    }
});

// Configuration des écouteurs d'événements pour le tri des colonnes
document.querySelectorAll(".sort-arrow").forEach(span => {
    span.addEventListener("click", () => {
        const column = span.dataset.column;

        if (currentSort.column === column) {
            currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.order = 'asc';
        }

        document.querySelectorAll(".sort-arrow").forEach(s => {
            s.textContent = "↕";
            s.classList.remove("active");
        });

        span.textContent = currentSort.order === 'asc' ? "↑" : "↓";
        span.classList.add("active");
        renderTable();
    });
});