// Fonction pour charger la navbar
function loadNavbar() {
  fetch('./components/navbar.html')
    .then(r => r.text())
    .then(html => {
  document.getElementById('navbar').innerHTML = html;
  // Appel des fonctions d'initialisation si elles existent
  if (window.initMobileNavbarScrollBehavior) window.initMobileNavbarScrollBehavior();
  if (window.initNavbarScrollBehavior) window.initNavbarScrollBehavior();
  if (window.initHamburger) window.initHamburger();
  if (window.initMobileNavbar) window.initMobileNavbar();
  if (window.setActiveNavbarLink) window.setActiveNavbarLink();
    });
}

// Charger la navbar au chargement
loadNavbar();

// Recharger la navbar si on resize (pour recharger le composant si besoin)
window.addEventListener('resize', () => {
  clearTimeout(window._navbarResizeTimeout);
  window._navbarResizeTimeout = setTimeout(loadNavbar, 200);
});

// Charger le footer
fetch('./components/footer.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  });

// Charger le modal Wi-Fi
fetch('./components/internet-modal.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('wifiModalContainer').innerHTML = html;

    // Appeler l'initialisation du modal seulement après injection
    import('./login-internet.js').then(module => {
      module.initWifiModal();
    });
  });
