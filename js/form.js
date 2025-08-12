// form.js
export function initForm(navigationApi) {
  const contactForm = document.getElementById('contact-form');
  const netBtn = document.getElementById('net-toggle');
  const netMenu = document.getElementById('net-menu');

  // Contact form submit (stay on page)
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method:'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        alert('Message sent!');
        navigationApi.resetToMenu();
        contactForm.reset();
      } else {
        alert('Failed to send.');
      }
    } catch (err) {
      alert('Network error.');
    }
  });

  // Network dropdown
  netBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = netMenu.style.display === 'block';
    netMenu.style.display = open ? 'none' : 'block';
    netBtn.setAttribute('aria-expanded', String(!open));
  });

  netMenu?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const choice = b.dataset.net;
    netMenu.style.display = 'none';
    netBtn.setAttribute('aria-expanded','false');
    if (choice === 'send message') {
      navigationApi.setActiveView('internet-form');
    } else {
      navigationApi.resetToMenu();
    }
  }));

  document.addEventListener('click', () => {
    if (netMenu) {
      netMenu.style.display = 'none';
      netBtn?.setAttribute('aria-expanded','false');
    }
  });
}
