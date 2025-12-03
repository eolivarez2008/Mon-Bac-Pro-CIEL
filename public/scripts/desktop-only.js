// Check if user is on mobile/tablet and show warning
function checkViewport() {
  const width = window.innerWidth;

  // Show warning if width < 1200px (tablets and phones)
  if (width < 1200) {
    showDesktopOnlyWarning();
  }
}

function showDesktopOnlyWarning() {
  // Avoid creating multiple overlays
  if (document.getElementById('desktop-only-overlay')) return;

  // Build overlay element
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

  // Replace entire body content so nothing behind is visible
  try {
    // Clear body and append overlay only
    document.body.innerHTML = '';
    document.body.appendChild(overlay);
    // Prevent scrolling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  } catch (e) {
    // Fallback: append overlay normally
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
}

// Check on load
document.addEventListener('DOMContentLoaded', checkViewport);

// Check on resize
window.addEventListener('resize', checkViewport);

// If user resizes to desktop width, reload the page to restore content
window.addEventListener('resize', function() {
  if (window.innerWidth >= 993 && document.getElementById('desktop-only-overlay')) {
    // reload to restore original DOM
    window.location.reload();
  }
});
