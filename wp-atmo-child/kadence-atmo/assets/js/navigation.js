(function () {
  const openButton = document.querySelector('[data-atmo-drawer-open]');
  const drawer = document.getElementById('nav-drawer');

  if (!openButton || !drawer) {
    return;
  }

  const closeButtons = drawer.querySelectorAll('[data-atmo-drawer-close]');

  function openDrawer() {
    drawer.classList.add('open');
    openButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    openButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openButton.addEventListener('click', openDrawer);
  closeButtons.forEach((button) => button.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  });
})();

