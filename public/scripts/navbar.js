// Gère l'état visuel (classe .active) des liens de la navbar en fonction de la page affichée
function setActiveNavbarLink() {
    const path = window.location.pathname
        .split('/')
        .pop()
        .replace(/\.html$/, '');

    document.querySelectorAll('.navbar .nav-link').forEach(link => {
        const href = link.getAttribute('href')
            .split('/')
            .pop()
            .replace(/\.html$/, '');

        const isHomeMatch =
            (path === '' || path === 'index') &&
            (href === '' || href === 'index');

        const isExactMatch = path === href;

        link.classList.toggle('active', isHomeMatch || isExactMatch);
    });
}


/* Gestion changement icône hamburger */
function initHamburger() {
    const navContent = document.getElementById('navContent');
    const toggler = document.querySelector('.navbar-toggler');
    const icon = toggler?.querySelector('.mdi');

    if (!navContent || !icon) return;

    navContent.addEventListener('show.bs.collapse', () => {
        icon.classList.remove('mdi-menu');
        icon.classList.add('mdi-close-thick');
    });

    navContent.addEventListener('hide.bs.collapse', () => {
        icon.classList.remove('mdi-close-thick');
        icon.classList.add('mdi-menu');
    });
}


/* Fermeture automatique menu mobile au clic */
function initMobileNavbar() {
    const navContent = document.getElementById('navContent');
    if (!navContent) return;

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const collapse =
                    bootstrap.Collapse.getInstance(navContent) ||
                    new bootstrap.Collapse(navContent);

                collapse.hide();
            }
        });
    });
}


/* Effet navbar au scroll */
function initNavbarScrollBehavior() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    });
}


/* Export global pour components-loader */
window.setActiveNavbarLink = setActiveNavbarLink;
window.initHamburger = initHamburger;
window.initMobileNavbar = initMobileNavbar;
window.initNavbarScrollBehavior = initNavbarScrollBehavior;