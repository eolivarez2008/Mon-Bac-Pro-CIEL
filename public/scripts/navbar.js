// Met à jour la classe active sur la navbar selon la page courante
function setActiveNavbarLink() {
  // Récupère le chemin sans les paramètres ni le hash
  const path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');

  // Desktop navbar : marquer le lien actif
  document.querySelectorAll('.desktop-navbar .nav-link').forEach(link => {
    let href = link.getAttribute('href').replace(/^\//, '').replace(/\.html$/, '');
    if ((path === '' && href === '') || (path === href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Appeler au chargement de la navbar
window.setActiveNavbarLink = setActiveNavbarLink;
