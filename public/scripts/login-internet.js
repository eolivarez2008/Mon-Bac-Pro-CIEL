export function initWifiModal() {
  const wifiBtn = document.getElementById("wifiBtnNavbar"); 
  const modal = document.getElementById("wifiModal");
  const closeModal = document.getElementById("closeModal");

  if (!wifiBtn || !modal || !closeModal) return;

  wifiBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
}
