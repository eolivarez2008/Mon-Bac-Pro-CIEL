document.addEventListener("DOMContentLoaded", () => {
    // Définition des constantes de configuration
    const JSON_DATA_URL = "../data/temoignages.json";
    const FORMSPREE_URL = "https://formspree.io/f/xzdaavnv";
    const DEBUG_MODE = false;
    const TIMEOUT_HOURS = DEBUG_MODE ? (30 / 3600) : 24;
    const AUTO_PLAY_DELAY = 8000;
    const STORAGE_KEY = "lastTestimonialTime";

    // Récupération des éléments du DOM
    const openBtn = document.getElementById("openFormBtn");
    const popup = document.getElementById("testimonialPopup");
    const testiBox = document.querySelector(".testi-box");
    const testimonialMessage = document.getElementById("testimonial-message");
    const testimonialMeta = document.getElementById("testimonial-meta");
    const form = document.getElementById("testimonialForm");
    
    // État de l'application
    let testimonials = [];
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayInterval;
    let tooltipUpdateInterval;

    // Création dynamique de l'alerte tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-alert";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);

    // Calcul du temps de verrouillage restant via le stockage local
    function getRemainingTime() {
        const lastTime = localStorage.getItem(STORAGE_KEY);
        if (!lastTime) return 0;
        const rem = (TIMEOUT_HOURS * 3600000) - (Date.now() - parseInt(lastTime));
        return rem > 0 ? rem : 0;
    }

    // Mise à jour de la disponibilité du bouton de soumission
    function updateButtonState() {
        const rem = getRemainingTime();
        if (rem > 0) {
            openBtn.disabled = true;
            openBtn.classList.add("btn-disabled");
            setTimeout(updateButtonState, 1000);
        } else {
            openBtn.disabled = false;
            openBtn.classList.remove("btn-disabled");
            localStorage.removeItem(STORAGE_KEY);
            tooltip.style.display = "none";
        }
    }

    // Formatage des millisecondes en unités temporelles lisibles
    function formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0) parts.push(`${m.toString().padStart(2, '0')}m`);
        parts.push(`${s.toString().padStart(2, '0')}s`);

        return parts.join(' ');
    }

    // Actualisation de la position et du contenu du tooltip
    function updateTooltipPosition() {
        const rem = getRemainingTime();
        if (rem <= 0) {
            tooltip.style.display = "none";
            clearInterval(tooltipUpdateInterval);
            return;
        }

        tooltip.textContent = DEBUG_MODE ? `Test : ${formatTime(rem)}` : `Attendez encore ${formatTime(rem)}`;

        const rect = openBtn.getBoundingClientRect();
        tooltip.style.display = "block";
        tooltip.style.top = `${window.scrollY + rect.top - tooltip.offsetHeight - 15}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
    }

    // Gestion des survols pour l'affichage du délai restant
    openBtn.addEventListener("mouseenter", () => {
        if (getRemainingTime() > 0) {
            updateTooltipPosition();
            tooltipUpdateInterval = setInterval(updateTooltipPosition, 1000);
        }
    });

    openBtn.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
        clearInterval(tooltipUpdateInterval);
    });

    // Gestion du cycle d'affichage et des transitions animées
    function display(index, direction = 'next') {
        if (isAnimating || testimonials.length === 0) return;
        isAnimating = true;

        const outClass = direction === 'next' ? 'slide-next-out' : 'slide-prev-out';
        const inClass = direction === 'next' ? 'slide-next-in' : 'slide-prev-in';

        testiBox.classList.add(outClass);

        setTimeout(() => {
            const t = testimonials[index];
            testimonialMessage.textContent = t.message;
            testimonialMeta.textContent = `— ${t.firstname} ${t.lastname}, ${t.classe}`;

            testiBox.style.transition = 'none';
            testiBox.classList.remove(outClass);
            testiBox.classList.add(inClass);

            void testiBox.offsetWidth;

            testiBox.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            testiBox.classList.remove(inClass);
            
            setTimeout(() => { isAnimating = false; }, 500);
        }, 500);
    }

    // Contrôle du défilement automatique
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            display(currentIndex, 'next');
        }, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() { 
        clearInterval(autoPlayInterval); 
    }

    // Écouteurs pour la navigation manuelle
    document.getElementById("next-btn").addEventListener("click", () => {
        stopAutoPlay(); 
        currentIndex = (currentIndex + 1) % testimonials.length;
        display(currentIndex, 'next'); 
        startAutoPlay();
    });

    document.getElementById("prev-btn").addEventListener("click", () => {
        stopAutoPlay(); 
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        display(currentIndex, 'prev'); 
        startAutoPlay();
    });

    // Affichage d'une notification de confirmation éphémère
    function showConfirmation(msg) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'confirmation-alert';
        alertDiv.innerHTML = `<i class="mdi mdi-check-circle me-2"></i>${msg}`;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }

    // Traitement et expédition du formulaire de témoignage
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const data = {
            firstname: document.getElementById("firstname").value.trim(),
            lastname: document.getElementById("lastname").value.trim(),
            classe: document.getElementById("classe").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        try {
            const r = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!r.ok) throw new Error();
            
            localStorage.setItem(STORAGE_KEY, Date.now());
            form.reset();
            popup.style.display = "none";
            document.body.style.overflow = "auto";
            
            showConfirmation("Témoignage envoyé ! Il sera ajouté après vérification.");
            updateButtonState();
        } catch(err) { 
            alert("Erreur d'envoi. Veuillez réessayer plus tard."); 
        }
    });

    // Chargement des données JSON et initialisation de l'affichage
    updateButtonState();
    (async function loadTestimonials() {
        try {
            const r = await fetch(JSON_DATA_URL);
            if (!r.ok) throw new Error("Fichier JSON introuvable");
            testimonials = await r.json();
            
            if (testimonials.length > 0) {
                const t = testimonials[0];
                testimonialMessage.textContent = t.message;
                testimonialMeta.textContent = `— ${t.firstname} ${t.lastname}, ${t.classe}`;
                startAutoPlay(); 
            }
        } catch(e) { 
            console.error(e);
            testimonialMessage.textContent = "Aucun témoignage disponible pour le moment."; 
        }
    })();

    // Gestion de l'ouverture et fermeture de la fenêtre modale
    openBtn.addEventListener("click", () => { 
        if(!getRemainingTime()) { 
            popup.style.display="flex"; 
            document.body.style.overflow="hidden"; 
        } 
    });
    
    document.getElementById("closePopup").addEventListener("click", () => { 
        popup.style.display="none"; 
        document.body.style.overflow="auto"; 
    });
});