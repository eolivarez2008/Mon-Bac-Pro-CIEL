/* Configuration initiale avec optimisation des performances mobiles */
const map = L.map('map', { 
    attributionControl: false,
    preferCanvas: true,
    tap: false,
    bounceAtZoomLimits: false
}).setView([46.603354, 1.888334], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 20 }).addTo(map);

/* Optimisation de l'interaction mobile */
if (window.innerWidth < 768) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.scrollWheelZoom.disable();
}

/* Définition de l'état global de l'application */
let lyceesData = [];
let filteredData = [];
let currentPage = 1;
const rowsPerPage = 20;
let currentSort = { column: 'codePostal', order: 'asc' };

/* Initialisation des références aux éléments du DOM */
const tableBody = document.getElementById("lyceesTableBody");
const pageInfo = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const toggleBtn = document.getElementById("toggleView");
const mapDiv = document.getElementById("map");
const tableDiv = document.getElementById("tableContainer");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const deptFilter = document.getElementById("deptFilter");

/* Récupération asynchrone des données et initialisation des composants */
fetch('./data/lycees.json')
    .then(r => r.json())
    .then(data => {
        /* Tri et stockage des données */
        lyceesData = data.sort((a, b) => 
            a.codePostal.localeCompare(b.codePostal, undefined, { numeric: true })
        );
        
        filteredData = [...lyceesData];
        populateDeptFilter(data);

        /* Définition du marqueur */
        const customIcon = L.divIcon({
            className: 'custom-school-pin',
            html: `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 26px;
                    height: 26px;
                    background: #ffffff;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    border: 1px solid #ccc;">
                    <i class="mdi mdi-school" style="
                        transform: rotate(45deg);
                        color: #222;
                        font-size: 14px;"></i>
                </div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 26]
        });

        /* Affichage de tous les marqueurs sur la carte */
        lyceesData.forEach(lycee => {
            if (lycee.coords?.length === 2) {
                L.marker(lycee.coords, { 
                    icon: customIcon,
                })
                .addTo(map)
                .bindPopup(`<b>${lycee.nom}</b><br>${lycee.ville} (${lycee.codePostal})`);
            }
        });

        /* Rendu initial du tableau */
        renderTable();
    })
    .catch(error => {
        console.error("Erreur de chargement :", error);
    });

/* Génération dynamique des options du filtre par département */
function populateDeptFilter(data) {
    const depts = [...new Set(data.map(l => l.codePostal.substring(0, 2)))].sort();
    depts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = `Département ${d}`;
        deptFilter.appendChild(opt);
    });
}

/* Application des filtres de recherche et de département sur le jeu de données */
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDept = deptFilter.value;

    filteredData = lyceesData.filter(lycee => {
        const matchesSearch = lycee.nom.toLowerCase().includes(searchTerm) || 
                              lycee.ville.toLowerCase().includes(searchTerm);
        const matchesDept = selectedDept === "" || lycee.codePostal.startsWith(selectedDept);
        return matchesSearch && matchesDept;
    });

    currentPage = 1;
    renderTable();
}

/* Gestion des écouteurs d'événements pour les filtres */
searchInput.addEventListener("input", applyFilters);
deptFilter.addEventListener("change", applyFilters);

/* Rendu du tableau HTML avec gestion de la pagination et des états visuels */
function renderTable() {
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(start, start + rowsPerPage);

    pageData.forEach(lycee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Établissement">${lycee.nom}</td>
            <td data-label="Ville">${lycee.ville}</td>
            <td data-label="Code Postal">${lycee.codePostal}</td>
        `;
        tableBody.appendChild(row);
    });

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);
    
    prevBtn.classList.toggle("btn-disabled", currentPage === 1);
    nextBtn.classList.toggle("btn-disabled", currentPage === totalPages);
}

/* Basculement de l'affichage entre la vue Liste et la vue Carte */
toggleBtn.addEventListener("click", () => {
    const isMapHidden = mapDiv.classList.toggle("d-none");
    
    tableDiv.classList.toggle("d-none", !isMapHidden);
    searchContainer.classList.toggle("d-none", !isMapHidden);
    
    document.getElementById("toggleText").textContent = isMapHidden ? "Carte" : "Liste";

    if (!isMapHidden) {
        setTimeout(() => map.invalidateSize(), 100);
    }
});

/* Gestion des événements de navigation pour la pagination */
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
        currentPage++;
        renderTable();
    }
});