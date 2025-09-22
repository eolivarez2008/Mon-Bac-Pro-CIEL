// Regarder si l'utilisateur est sur un appareil desktop (largeur >= 1200px).
function checkViewport() {
  const width = window.innerWidth;

  // Si largeur inférieure à 1200px, afficher le message d'avertissement
  if (width < 1200) {
    showDesktopOnlyWarning();
  }
}

function showDesktopOnlyWarning() {
  // Si l'overlay existe déjà, ne rien faire
  if (document.getElementById('desktop-only-overlay')) return;

  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.id = 'desktop-only-overlay';
  overlay.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100vw',
    'height:100vh',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'z-index:2147483647',
    'background:#07111a',
    'color:#e6eef6',
    'padding:20px',
    'box-sizing:border-box'
  ].join(';');

  const warningBox = document.createElement('div');
  warningBox.style.cssText = [
    'background:#0f2027',
    'border-radius:12px',
    'padding:28px',
    'max-width:460px',
    'width:100%',
    'text-align:center',
    'box-shadow:0 8px 30px rgba(0,0,0,0.6)'
  ].join(';');

  warningBox.innerHTML = `
    <div style="font-size:48px;margin-bottom:14px">💻</div>
    <h2 style="color:#66d9ff;margin:0 0 10px 0;font-size:22px;font-weight:700">Accès Desktop Requis</h2>
    <p style="margin:0 0 8px 0;color:#d0d8df;font-size:15px;line-height:1.4">Ce site a été optimisé uniquement pour les ordinateurs de bureau.</p>
    <p style="margin:0;color:#9aa6b2;font-size:13px">Veuillez accéder au site sur un PC ou un laptop pour une meilleure expérience.</p>
  `;

  overlay.appendChild(warningBox);

  // Remplacer le contenu de body par l'overlay
  try {
    // Nettoyer le body avant d'ajouter l'overlay
    document.body.innerHTML = '';
    document.body.appendChild(overlay);
    // Bloquer le scroll en overflow hidden
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  } catch (e) {
    // En cas d'erreur, ajouter l'overlay sans vider le body
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
}

// Regarder au chargement de la page
document.addEventListener('DOMContentLoaded', checkViewport);

// Regarder au redimensionnement de la fenêtre
window.addEventListener('resize', checkViewport);

// Si on redimensionne au-dessus de 992px, recharger la page pour restaurer le DOM original
window.addEventListener('resize', function() {
  if (window.innerWidth >= 993 && document.getElementById('desktop-only-overlay')) {
    // Recharger la page
    window.location.reload();
  }
});
