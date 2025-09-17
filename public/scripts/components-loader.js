// Charger la navbar
fetch('./components/navbar.html')
  .then(r => r.text())
  .then(html => {
    document.getElementById('navbar').innerHTML = html;

    // Ré-initialiser le JS de la navbar pour le mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn?.addEventListener('click', () => {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
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
