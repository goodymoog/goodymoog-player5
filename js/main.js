// main.js
import { createNavigation } from './navigation.js';
import { createSecretController } from './secret.js';
import { initAlbums } from './albums.js';
import { initForm } from './form.js';

const nav = createNavigation();
const secret = createSecretController(() => nav.setActiveView('secret'));

// Menu selection
const items = document.querySelectorAll('.menu-item');
let selectedIndex = 0;
function updateSelection(){
  items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
}
document.addEventListener('keydown', (e) => {
  if (isEditableTarget(e.target)) return;
  if (e.key === 'ArrowDown') { selectedIndex = (selectedIndex + 1) % items.length; updateSelection(); }
  else if (e.key === 'ArrowUp') { selectedIndex = (selectedIndex - 1 + items.length) % items.length; updateSelection(); }
  else if (e.key === 'Enter') { const link = items[selectedIndex]?.querySelector('a'); if (link) window.open(link.href,'_blank'); }
});

// Buttons
const btnMenu = document.querySelector('.btn-label.menu');
const btnRW = document.querySelector('.btn-label.rw');
const btnFW = document.querySelector('.btn-label.fw');
const btnPlay = document.querySelector('.btn-label.play');
const btnCenter = document.querySelector('.center-btn');
const hitMenu = document.querySelector('.hit-menu');
const hitRW = document.querySelector('.hit-rw');
const hitFW = document.querySelector('.hit-fw');
const hitPlay = document.querySelector('.hit-play');

btnMenu.addEventListener('click', () => { secret.registerButton('menu'); nav.resetToMenu(); });
btnPlay.addEventListener('click', () => { const unlocked = secret.registerButton('play'); if (!unlocked) { nav.setActiveView(nav.currentViewId.startsWith('now-playing') ? nav.currentViewId : 'now-playing-1'); }});
btnFW.addEventListener('click', () => { secret.registerButton('fw'); nav.next(); });
btnRW.addEventListener('click', () => { secret.registerButton('rw'); nav.prev(); });
btnCenter.addEventListener('click', () => { secret.registerButton('center'); const link = items[selectedIndex]?.querySelector('a'); if (link) window.open(link.href,'_blank'); });
hitMenu.addEventListener('click', () => btnMenu.click());
hitRW.addEventListener('click', () => btnRW.click());
hitFW.addEventListener('click', () => btnFW.click());
hitPlay.addEventListener('click', () => btnPlay.click());

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (isEditableTarget(e.target)) return;
  if (key === 'm') { e.preventDefault(); btnMenu.click(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); btnRW.click(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); btnFW.click(); }
  else if (key === 'p' || e.code === 'Space') { e.preventDefault(); btnPlay.click(); }
});

// Prevent global keyboard shortcuts while typing in form fields
function isEditableTarget(t) {
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}

// Init feature modules
initAlbums();
initForm(nav);
