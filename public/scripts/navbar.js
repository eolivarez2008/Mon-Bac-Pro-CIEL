// Identification et activation du lien de navigation correspondant à l'URL courante
function setActiveNavbarLink() {
    const path = window.location.pathname.split('/').pop().replace(/\.html$/, '');

    document.querySelectorAll('.navbar .nav-link').forEach(link => {
        const href = link.getAttribute('href').split('/').pop().replace(/\.html$/, '');
        const isHomeMatch = (path === '' || path === 'index') && (href === '' || href === 'index');
        const isExactMatch = path === href;

        link.classList.toggle('active', isHomeMatch || isExactMatch);
    });
}

// Gestion de la fermeture automatique du menu mobile via Bootstrap
document.addEventListener('click', (event) => {
    const collapse = document.querySelector('.navbar-collapse');
    if (!collapse?.classList.contains('show')) return;

    const isLinkClick = event.target.classList.contains('nav-link');
    const isOutsideClick = !collapse.contains(event.target);

    if (isLinkClick || isOutsideClick) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse);
        bsCollapse.hide();
    }
});

// Mise à jour de l'état visuel de la barre de navigation selon le défilement
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.floating-nav');
    if (nav) {
        nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    }
});

// Exportation et exécution initiale du module
window.addEventListener('DOMContentLoaded', setActiveNavbarLink);
window.setActiveNavbarLink = setActiveNavbarLink;