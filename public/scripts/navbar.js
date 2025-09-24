// Masquer/afficher la barre d'icônes mobile au scroll
function initMobileNavbarScrollBehavior() {
	const mobileBar = document.querySelector('.navbar-mobile-icons');
	if (!mobileBar) return;
	let lastScrollY = window.scrollY;
	window.addEventListener('scroll', () => {
		const currentScrollY = window.scrollY;
		if (currentScrollY > lastScrollY && currentScrollY > 100) {
			mobileBar.style.transform = 'translateY(-102%)';
		} else {
			mobileBar.style.transform = 'translateY(0)';
		}
		lastScrollY = currentScrollY;
	});
}
// Version mobile : menu hamburger
function initMobileNavbar() {
	const hamburger = document.querySelector('.navbar-mobile .hamburger');
	const sideMenu = document.querySelector('.navbar-mobile .side-menu');
	if (hamburger && sideMenu) {
		hamburger.addEventListener('click', function() {
			sideMenu.classList.toggle('active');
			hamburger.classList.toggle('active');
		});
		// Fermer le menu si on clique en dehors
		document.addEventListener('click', function(e) {
			if (!sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
				sideMenu.classList.remove('active');
				hamburger.classList.remove('active');
			}
		});
	}
	// Met à jour la classe active sur la navbar selon la page courante
	function setActiveNavbarLink() {
	  // Récupère le chemin sans les paramètres ni le hash
	  const path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');

		// Desktop navbar
		document.querySelectorAll('.desktop-navbar .nav-link').forEach(link => {
			let href = link.getAttribute('href').replace(/^\//, '').replace(/\.html$/, '');
			if ((path === '' && href === '') || (path === href)) {
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
		});

		// Mobile navbar
		document.querySelectorAll('.navbar-mobile-icons .icon-link').forEach(link => {
			let href = link.getAttribute('href');
			// Normalise le href pour comparer avec path
			href = href.replace(/^\//, '').replace(/\.html$/, '');
			if ((path === '' && href === '') || (path === href)) {
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
		});
	}

	// Appeler la fonction après le chargement de la navbar
	window.setActiveNavbarLink = setActiveNavbarLink;
}
