
(function () {
  const navbar = document.getElementById('navbar');
  function updateNavbarShadow() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  updateNavbarShadow();
  window.addEventListener('scroll', updateNavbarShadow, { passive: true });
})();