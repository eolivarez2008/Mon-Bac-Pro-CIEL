// Initialisation de la carte centrée sur la France
const map = L.map('map').setView([46.603354, 1.888334], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let lyceesData = [];
let currentPage = 1;
const rowsPerPage = 20;
let currentSort = { column: null, order: 'asc' };

const tableBody = document.getElementById("lyceesTableBody");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");

// Toggle carte <-> tableau
const toggleBtn = document.getElementById("toggleView");
const toggleIcon = document.getElementById("toggleIcon");
const toggleText = document.getElementById("toggleText");
const mapDiv = document.getElementById("map");
const tableDiv = document.getElementById("tableContainer");

toggleBtn.addEventListener("click", () => {
  if (mapDiv.classList.contains("d-none")) {
    mapDiv.classList.remove("d-none");
    tableDiv.classList.add("d-none");
    toggleIcon.textContent = "📋";
    toggleText.textContent = "Liste";
    map.invalidateSize();
  } else {
    mapDiv.classList.add("d-none");
    tableDiv.classList.remove("d-none");
    toggleIcon.textContent = "📍";
    toggleText.textContent = "Carte";
  }
});

// Charger le fichier JSON
fetch('./data/lycees.json')
  .then(r => r.json())
  .then(data => {
    // Tri par codePostal par défaut
    lyceesData = data.sort((a, b) => {
      return a.codePostal.localeCompare(b.codePostal, undefined, {numeric: true});
    });

    // Ajouter tous les lycées sur la carte
    lyceesData.forEach(lycee => {
      if (lycee.coords && lycee.coords.length === 2) {
        L.marker(lycee.coords).addTo(map)
          .bindPopup(`<b>${lycee.nom}</b><br>${lycee.ville} (${lycee.codePostal})`);
      }
    });

    renderTable();
  })
  .catch(error => console.error("Erreur de chargement du JSON :", error));


// Fonction d’affichage du tableau
function renderTable() {
  tableBody.innerHTML = "";
  let sorted = [...lyceesData];

  // Tri si demandé
  if (currentSort.column) {
    sorted.sort((a, b) => {
      let valA = (a[currentSort.column] || "").toString().toLowerCase();
      let valB = (b[currentSort.column] || "").toString().toLowerCase();
      if (valA < valB) return currentSort.order === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = sorted.slice(start, end);

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

// Pagination
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

// Tri uniquement sur la flèche
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
