import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  // ================== CONFIG FIREBASE ==================
  const firebaseConfig = { 
    apiKey: "AIzaSyD7wnWLPU-BlYJ99NrsUKPzZdyRcMIM-i0", 
    authDomain: "mon-bac-pro-ciel.firebaseapp.com", 
    projectId: "mon-bac-pro-ciel", 
    storageBucket: "mon-bac-pro-ciel.firebasestorage.app", 
    messagingSenderId: "391462981046", 
    appId: "1:391462981046:web:813ec72bb4b448584f8517" 
  };

  const app = initializeApp(firebaseConfig); // Initialiser Firebase
  const db = getFirestore(app); // Initialiser Firestore

  // ================== VARIABLES DOM ==================
  const openBtn = document.getElementById("openFormBtn"); // bouton pour ouvrir le popup
  const popup = document.getElementById("testimonialPopup"); // popup formulaire
  const closeBtn = document.getElementById("closePopup"); // bouton fermer
  const messageInput = document.getElementById("message"); // textarea message
  const charCount = document.getElementById("charCount"); // compteur de caractères
  const confirmationMessage = document.createElement('div'); // élément pour les alertes

  // ================== TIMEOUT / LOCALSTORAGE ==================
  const TIMEOUT_HOURS = 24; // Durée du cooldown en heures
  const STORAGE_KEY = "lastTestimonialTime"; // clé pour localStorage

  // ================== TOOLTIP ==================
  const tooltip = document.createElement("div"); // créer l'élément tooltip
  tooltip.className = "tooltip-alert";
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  let tooltipInterval; // intervalle pour mettre à jour le tooltip en temps réel

  // ================== FONCTIONS TIMEOUT ==================

  // Vérifie si l'utilisateur est toujours en cooldown
  function checkTimeout() {
    const lastTime = localStorage.getItem(STORAGE_KEY);
    if (!lastTime) return false; // jamais envoyé
    const now = new Date().getTime();
    const elapsed = now - parseInt(lastTime, 10);
    return elapsed < TIMEOUT_HOURS * 60 * 60 * 1000; // true si moins de 24h
  }

  // Calcule le temps restant en ms
  function getRemainingTime() {
    const lastTime = localStorage.getItem(STORAGE_KEY);
    if (!lastTime) return 0;
    const now = new Date().getTime();
    const elapsed = now - parseInt(lastTime, 10);
    const remaining = TIMEOUT_HOURS * 60 * 60 * 1000 - elapsed;
    return remaining > 0 ? remaining : 0;
  }

  // Met à jour l'état du bouton (disabled / enabled)
  function updateButtonState() {
    if (checkTimeout()) {
      openBtn.disabled = true;
      openBtn.classList.add("btn-disabled");
    } else {
      openBtn.disabled = false;
      openBtn.classList.remove("btn-disabled");
    }
  }

  // ================== TOOLTIP DYNAMIQUE ==================
  function updateTooltip() {
    const remainingMs = getRemainingTime();

    // Si le cooldown est terminé, réactive le bouton et masque le tooltip
    if (remainingMs <= 0) {
      openBtn.disabled = false;
      openBtn.classList.remove("btn-disabled");
      tooltip.style.display = "none";
      clearInterval(tooltipInterval);
      return;
    }

    // Calcul des heures, minutes et secondes restantes
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    tooltip.textContent = `Réessayez dans ${hours}h ${minutes}m ${seconds}s.`;

    // Calcul position centre du bouton
    const rectBtn = openBtn.getBoundingClientRect();
    const centerX = rectBtn.left + rectBtn.width / 2;
    const centerY = rectBtn.top + rectBtn.height / 2;

    const verticalOffset = 45; // distance du centre du bouton vers le haut
    tooltip.style.top = (centerY - verticalOffset) + "px"; // monte le tooltip
    tooltip.style.left = centerX + "px"; // reste centré horizontalement
    tooltip.style.display = "block";
  }

  // Afficher le tooltip au survol
  openBtn.addEventListener("mouseenter", () => {
    if (openBtn.disabled) {
      updateTooltip(); // affichage immédiat
      tooltipInterval = setInterval(updateTooltip, 1000); // mise à jour toutes les secondes
      tooltip.style.display = "block";
    }
  });

  // Masquer le tooltip quand la souris quitte le bouton
  openBtn.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    clearInterval(tooltipInterval);
  });

  updateButtonState(); // état initial du bouton au chargement

  // ================== POPUP ==================
  const openPopup = () => {
    if (checkTimeout()) return; // ne pas ouvrir si cooldown
    popup.style.display = "flex";
    document.body.classList.add('body-no-scroll');
  };

  const closePopup = () => {
    popup.style.display = "none";
    document.body.classList.remove('body-no-scroll');
  };

  openBtn.addEventListener("click", openPopup);
  closeBtn.addEventListener("click", closePopup);
  popup.addEventListener("click", e => { if(e.target === popup) closePopup(); });

  // ================== COMPTEUR DE CARACTERES ==================
  messageInput.addEventListener("input", () => {
    charCount.textContent = `${messageInput.value.length} / 200`;
  });

  // ================== FORMULAIRE ==================
  const form = document.getElementById("testimonialForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstname = document.getElementById("firstname").value.trim();
    const lastname  = document.getElementById("lastname").value.trim();
    const classe    = document.getElementById("classe").value.trim();
    const message   = document.getElementById("message").value.trim();

    if(!firstname || !lastname || !classe || !message) return; // validation simple

    try {
      // Envoi du témoignage vers Firebase
      await addDoc(collection(db, "temoignages"), {
        firstname,
        lastname,
        classe,
        message,
        approved: false,
        date: serverTimestamp()
      });

      // Stocker l'heure d'envoi pour le cooldown
      localStorage.setItem(STORAGE_KEY, new Date().getTime());

      // Afficher confirmation
      showConfirmation();
      form.reset();
      charCount.textContent = "0 / 200";
      closePopup();
      updateButtonState(); // désactiver le bouton
    } catch(err) {
      console.error(err);
      showError("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  });

  // ================== ALERTES ==================
  function showConfirmation() {
    confirmationMessage.innerHTML = `
      <div class="confirmation-alert">
        <span class="mdi mdi-check-circle"></span>
        Merci ! Votre témoignage a été envoyé pour validation.
      </div>
    `;
    if (!document.querySelector('.confirmation-alert')) {
      const mainContent = document.querySelector('.site-wrap');
      mainContent.insertBefore(confirmationMessage, mainContent.firstChild);
    }
    setTimeout(() => {
      if (confirmationMessage.parentNode) confirmationMessage.parentNode.removeChild(confirmationMessage);
    }, 5000);
  }

  function showError(message) {
    confirmationMessage.innerHTML = `
      <div class="error-alert">
        <span class="mdi mdi-alert-circle"></span>
        ${message}
      </div>
    `;
    if (!document.querySelector('.error-alert')) {
      const mainContent = document.querySelector('.site-wrap');
      mainContent.insertBefore(confirmationMessage, mainContent.firstChild);
    }
    setTimeout(() => {
      if (confirmationMessage.parentNode) confirmationMessage.parentNode.removeChild(confirmationMessage);
    }, 5000);
  }

  // ================== TESTIMONIALS ==================
  const testimonialMessage = document.getElementById("testimonial-message");
  const testimonialMeta = document.getElementById("testimonial-meta");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let testimonials = [];
  let currentIndex = 0;
  let autoSlideInterval;

  // Charger les témoignages approuvés
  async function loadTestimonials() {
    const q = query(collection(db, "temoignages"), where("approved", "==", true));
    const querySnapshot = await getDocs(q);
    testimonials = querySnapshot.docs.map(doc => doc.data());

    if (testimonials.length > 0) {
      showTestimonial(currentIndex);
      startAutoSlide();
    } else {
      testimonialMessage.textContent = "Aucun témoignage pour le moment.";
    }
  }

  // Afficher un témoignage avec effet fade
  function showTestimonial(index) {
    testimonialMessage.classList.add("fade-out");
    testimonialMeta.classList.add("fade-out");

    setTimeout(() => {
      const t = testimonials[index];
      testimonialMessage.textContent = `"${t.message}"`;
      testimonialMeta.textContent = `— ${t.firstname} ${t.lastname}, ${t.classe}`;

      testimonialMessage.classList.remove("fade-out");
      testimonialMeta.classList.remove("fade-out");
      testimonialMessage.classList.add("fade-in");
      testimonialMeta.classList.add("fade-in");

      setTimeout(() => {
        testimonialMessage.classList.remove("fade-in");
        testimonialMeta.classList.remove("fade-in");
      }, 500);
    }, 300);
  }

  // Navigation manuelle
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
    resetAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
    resetAutoSlide();
  });

  // Auto-slide toutes les 5 secondes
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 10000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  loadTestimonials(); // lancement au chargement

});
