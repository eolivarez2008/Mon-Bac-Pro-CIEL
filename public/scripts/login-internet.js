export function initWifiModal() {
  // Récupère le bouton qui ouvre le modal, le modal lui-même et le bouton de fermeture
  const wifiBtn = document.getElementById("wifiBtnNavbar"); 
  const modal = document.getElementById("wifiModal");
  const closeModal = document.getElementById("closeModal");

  // Si un des éléments est manquant, on arrête la fonction pour éviter les erreurs
  if (!wifiBtn || !modal || !closeModal) return;

  // Quand on clique sur le bouton Wi-Fi, on affiche le modal et on bloque le scroll
  wifiBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  });

  // Quand on clique sur le bouton de fermeture, on cache le modal et on débloque le scroll
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  // Si on clique en dehors du contenu du modal (sur le fond), on ferme aussi le modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
}
