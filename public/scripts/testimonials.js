document.addEventListener("DOMContentLoaded", () => {

  // ================== CONFIGURATION API ==================
  // En local : http://localhost:3000
  // En prod : https://monbacprociel.eolivarez.site/api
  const API_URL = "https://monbacprociel.eolivarez.site/api";

  // ================== VARIABLES DOM ==================
  const openBtn = document.getElementById("openFormBtn");
  const popup = document.getElementById("testimonialPopup");
  const closeBtn = document.getElementById("closePopup");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  const confirmationMessage = document.createElement('div');

  const testimonialMessage = document.getElementById("testimonial-message");
  const testimonialMeta = document.getElementById("testimonial-meta");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // ================== TIMEOUT / LOCALSTORAGE ==================
  const TIMEOUT_HOURS = 24; 
  const STORAGE_KEY = "lastTestimonialTime"; 

  // ================== TOOLTIP ==================
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-alert";
  tooltip.style.display = "none";
  document.body.appendChild(tooltip);

  let tooltipInterval;

  // ================== FONCTIONS TIMEOUT ==================
  function checkTimeout() {
    const lastTime = localStorage.getItem(STORAGE_KEY);
    if (!lastTime) return false;
    const now = new Date().getTime();
    const elapsed = now - parseInt(lastTime, 10);
    return elapsed < TIMEOUT_HOURS * 60 * 60 * 1000;
  }

  function getRemainingTime() {
    const lastTime = localStorage.getItem(STORAGE_KEY);
    if (!lastTime) return 0;
    const now = new Date().getTime();
    const elapsed = now - parseInt(lastTime, 10);
    const remaining = TIMEOUT_HOURS * 60 * 60 * 1000 - elapsed;
    return remaining > 0 ? remaining : 0;
  }

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
    if (remainingMs <= 0) {
      openBtn.disabled = false;
      openBtn.classList.remove("btn-disabled");
      tooltip.style.display = "none";
      clearInterval(tooltipInterval);
      return;
    }

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    tooltip.textContent = `Réessayez dans ${hours}h ${minutes}m ${seconds}s.`;

    const rectBtn = openBtn.getBoundingClientRect();
    const centerX = rectBtn.left + rectBtn.width / 2;
    const centerY = rectBtn.top + rectBtn.height / 2;
    tooltip.style.top = (centerY - 45) + "px";
    tooltip.style.left = centerX + "px";
  }

  openBtn.addEventListener("mouseenter", () => {
    if (openBtn.disabled) {
      updateTooltip();
      tooltipInterval = setInterval(updateTooltip, 1000);
      tooltip.style.display = "block";
    }
  });

  openBtn.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
    clearInterval(tooltipInterval);
  });

  updateButtonState();

  // ================== POPUP ==================
  const openPopup = () => {
    if (checkTimeout()) return;
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

  // ================== COMPTEUR ==================
  messageInput.addEventListener("input", () => {
    charCount.textContent = `${messageInput.value.length} / 200`;
  });

  // ================== FORMULAIRE (ENVOI API) ==================
  const form = document.getElementById("testimonialForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstname = document.getElementById("firstname").value.trim();
    const lastname  = document.getElementById("lastname").value.trim();
    const classe    = document.getElementById("classe").value.trim();
    const message   = document.getElementById("message").value.trim();

    if(!firstname || !lastname || !classe || !message) return;

    try {
      const response = await fetch(`${API_URL}/temoignage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, classe, message })
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi");

      localStorage.setItem(STORAGE_KEY, new Date().getTime());
      showConfirmation();
      form.reset();
      charCount.textContent = "0 / 200";
      closePopup();
      updateButtonState();
    } catch(err) {
      console.error(err);
      showError("Erreur de connexion au serveur.");
    }
  });

  // ================== ALERTES ==================
  function showConfirmation() {
    confirmationMessage.innerHTML = `
      <div class="confirmation-alert">
        <span class="mdi mdi-check-circle"></span>
        Merci ! Votre témoignage a été envoyé pour validation.
      </div>`;
    const mainContent = document.querySelector('.site-wrap');
    mainContent.insertBefore(confirmationMessage, mainContent.firstChild);
    setTimeout(() => { if (confirmationMessage.parentNode) confirmationMessage.parentNode.removeChild(confirmationMessage); }, 5000);
  }

  function showError(msg) {
    confirmationMessage.innerHTML = `<div class="error-alert"><span class="mdi mdi-alert-circle"></span> ${msg}</div>`;
    const mainContent = document.querySelector('.site-wrap');
    mainContent.insertBefore(confirmationMessage, mainContent.firstChild);
    setTimeout(() => { if (confirmationMessage.parentNode) confirmationMessage.parentNode.removeChild(confirmationMessage); }, 5000);
  }

  // ================== CARROUSEL (LECTURE API) ==================
  let testimonials = [];
  let currentIndex = 0;
  let autoSlideInterval;

  async function loadTestimonials() {
    try {
      const response = await fetch(`${API_URL}/messages`);
      testimonials = await response.json();

      if (testimonials.length > 0) {
        showTestimonial(currentIndex);
        startAutoSlide();
      } else {
        testimonialMessage.textContent = "Aucun témoignage pour le moment.";
      }
    } catch (err) {
      console.error(err);
      testimonialMessage.textContent = "Erreur de chargement des témoignages.";
    }
  }

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

  prevBtn.addEventListener("click", () => {
    if (testimonials.length === 0) return;
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
    resetAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    if (testimonials.length === 0) return;
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
    resetAutoSlide();
  });

  function startAutoSlide() {
    if (testimonials.length > 1) {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 10000);
    }
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  loadTestimonials();
});