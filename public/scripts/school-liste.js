// Initialisation de la carte centrée sur la France
const map = L.map('map').setView([46.603354, 1.888334], 6);

// Ajout des tuiles OpenStreetMap sur la carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Variables pour gérer les données, la pagination et le tri
let lyceesData = [];
let currentPage = 1;
const rowsPerPage = 20;
let currentSort = { column: null, order: 'asc' };

// Récupération des éléments du DOM liés au tableau et à la pagination
const tableBody = document.getElementById("lyceesTableBody");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");

// Éléments pour basculer entre carte et tableau
const toggleBtn = document.getElementById("toggleView");
const toggleIcon = document.getElementById("toggleIcon");
const toggleText = document.getElementById("toggleText");
const mapDiv = document.getElementById("map");
const tableDiv = document.getElementById("tableContainer");

// Bouton pour alterner entre affichage carte et tableau
toggleBtn.addEventListener("click", () => {
  if (mapDiv.classList.contains("d-none")) {
    // Affiche la carte, cache le tableau
    mapDiv.classList.remove("d-none");
    tableDiv.classList.add("d-none");
    toggleIcon.textContent = "📋";
    toggleText.textContent = "Liste";
    map.invalidateSize();
  } else {
    // Affiche le tableau, cache la carte
    mapDiv.classList.add("d-none");
    tableDiv.classList.remove("d-none");
    toggleIcon.textContent = "📍";
    toggleText.textContent = "Carte";
  }
});

// Chargement du fichier JSON contenant les lycées
fetch('./data/lycees.json')
  .then(r => r.json())
  .then(data => {
    // Tri initial des lycées par code postal
    lyceesData = data.sort((a, b) => {
      return a.codePostal.localeCompare(b.codePostal, undefined, {numeric: true});
    });

    // Ajout d'un marqueur sur la carte pour chaque lycée
    lyceesData.forEach(lycee => {
      if (lycee.coords && lycee.coords.length === 2) {
        L.marker(lycee.coords).addTo(map)
          .bindPopup(`<b>${lycee.nom}</b><br>${lycee.ville} (${lycee.codePostal})`);
      }
    });

    // Affichage initial du tableau
    renderTable();
  })
  .catch(error => console.error("Erreur de chargement du JSON :", error));

// Fonction pour afficher le tableau des lycées
function renderTable() {
  tableBody.innerHTML = "";
  let sorted = [...lyceesData];

  // Tri si une colonne est sélectionnée
  if (currentSort.column) {
    sorted.sort((a, b) => {
      let valA = (a[currentSort.column] || "").toString().toLowerCase();
      let valB = (b[currentSort.column] || "").toString().toLowerCase();
      if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination : calcul des lignes à afficher
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = sorted.slice(start, end);

  // Ajout des lignes au tableau
  pageData.forEach(lycee => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${lycee.nom}</td>
      <td>${lycee.ville}</td>
      <td>${lycee.codePostal}</td>
    `;
    tableBody.appendChild(row);
  });

  // Mise à jour des infos de pagination
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Gestion des boutons de pagination
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

// Tri des colonnes au clic sur la flèche correspondante
document.querySelectorAll(".sort-arrow").forEach(span => {
  span.addEventListener("click", () => {
    const column = span.dataset.column;

    // Inverse l'ordre si même colonne, sinon tri asc sur nouvelle colonne
    if (currentSort.column === column) {
      currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.order = 'asc';
    }

    // Réinitialise toutes les flèches
    document.querySelectorAll(".sort-arrow").forEach(s => {
      s.textContent = "↕";
      s.classList.remove("active");
    });

    // Met à jour la flèche de la colonne triée
    span.textContent = currentSort.order === 'asc' ? "↑" : "↓";
    span.classList.add("active");

    // Rafraîchit le tableau
    renderTable();
  });
});
