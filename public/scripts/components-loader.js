// Chargement et injection de composants HTML externes
async function loadComponent(url, selector, callback = null) {
    const target = document.getElementById(selector);
    if (!target) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        target.innerHTML = html;
        
        if (callback) callback();
    } catch (error) {
        console.error(`Erreur lors du chargement de ${url}:`, error);
    }
}

// Initialisation globale des modules logiques de la barre de navigation
function initNavbarLogic() {
    const initializers = [
        'initMobileNavbarScrollBehavior',
        'initNavbarScrollBehavior',
        'initHamburger',
        'initMobileNavbar',
        'setActiveNavbarLink'
    ];

    initializers.forEach(fn => {
        if (typeof window[fn] === 'function') window[fn]();
    });
}

// Exécution des chargements de composants au montage du DOM
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('/components/navbar.html?v=2', 'navbar', initNavbarLogic);
    loadComponent('/components/footer.html?v=2', 'footer');
});

// Réinitialisation de la logique d'interface lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    clearTimeout(window._navbarResizeTimeout);
    window._navbarResizeTimeout = setTimeout(initNavbarLogic, 250);
});