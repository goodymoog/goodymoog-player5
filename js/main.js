// main.js
import { createNavigation } from './navigation.js';
import { createSecretController } from './secret.js';
import { initAlbums } from './albums.js';
import { initForm } from './form.js';
import { TRACKS } from "./tracks.js";

const nav = createNavigation();
const secret = createSecretController(() => nav.setActiveView('secret'));

// ===== MAIN MENU selection (scope to #menu-list only) =====
const menuItems = () => Array.from(document.querySelectorAll('#menu-list .menu-item'));
let selectedIndex = 0;

function updateMenuSelection() {
  const items = menuItems();

  items.forEach((item, i) => {
    item.classList.toggle("selected", i === selectedIndex);
  });

  const selectedItem = items[selectedIndex];

  if (selectedItem) {
    selectedItem.scrollIntoView({
      block: "nearest",   // only scroll when needed
      behavior: "auto"    // no animation (feels more iPod)
    });
  }
}

function openSelectedMenuLink() {
  const items = menuItems();
  const link = items[selectedIndex]?.querySelector('a');
  if (link) window.open(link.href, '_blank');
}

// Prevent global keyboard shortcuts while typing in form fields
function isEditableTarget(t) {
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}

// Keyboard navigation for MAIN MENU only
document.addEventListener('keydown', (e) => {
  if (isEditableTarget(e.target)) return;

  if (nav.currentViewId !== 'main-menu') return;

  const items = menuItems();
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % items.length;
    updateMenuSelection();
  } else if (e.key === 'ArrowUp') {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateMenuSelection();
  } else if (e.key === 'Enter') {
    openSelectedMenuLink();
  }
});

// ===== Buttons =====
const btnMenu = document.querySelector('.btn-label.menu');
const btnRW = document.querySelector('.btn-label.rw');
const btnFW = document.querySelector('.btn-label.fw');
const btnPlay = document.querySelector('.btn-label.play');
const btnCenter = document.querySelector('.center-btn');

const hitMenu = document.querySelector('.hit-menu');
const hitRW = document.querySelector('.hit-rw');
const hitFW = document.querySelector('.hit-fw');
const hitPlay = document.querySelector('.hit-play');

const wheel = document.querySelector('.clickwheel');

function applyPress(cls) {
  if (!wheel) return;

  wheel.classList.remove('press-menu','press-play','press-rw','press-fw');
  wheel.classList.add(cls);

  clearTimeout(applyPress._t);
  applyPress._t = setTimeout(() => {
    wheel.classList.remove(cls);
  }, 120);
}

// Trigger from hitboxes (mobile)
hitMenu?.addEventListener('pointerdown', () => applyPress('press-menu'));
hitPlay?.addEventListener('pointerdown', () => applyPress('press-play'));
hitRW?.addEventListener('pointerdown', () => applyPress('press-rw'));
hitFW?.addEventListener('pointerdown', () => applyPress('press-fw'));

// ALSO trigger from visible labels/icons (desktop + mobile)
btnMenu?.addEventListener('pointerdown', () => applyPress('press-menu'));
btnPlay?.addEventListener('pointerdown', () => applyPress('press-play'));
btnRW?.addEventListener('pointerdown', () => applyPress('press-rw'));
btnFW?.addEventListener('pointerdown', () => applyPress('press-fw'));

btnMenu.addEventListener('click', () => {
  secret.registerButton('menu');
  nav.resetToMenu();
  updateMenuSelection();
});

// ===== MP3 Music Page (now-playing-1) iPod list logic =====
const trackList = document.getElementById("track-list");
const audioEl = document.getElementById("audio");
const trackNow = document.getElementById("track-now");

let trackIndex = 0;

function renderTrackList() {
  if (!trackList) return;

  trackList.innerHTML = TRACKS.map((t, i) => {
    const selected = i === trackIndex ? "selected" : "";
    return `
      <li class="menu-item ${selected}" data-i="${i}">
        <span>${t.title}</span>
        <span class="chevron">›</span>
      </li>
    `;
  }).join("");
}

function setTrackIndex(next) {
  if (!TRACKS.length) return;
  trackIndex = (next + TRACKS.length) % TRACKS.length;
  renderTrackList();
}

function playTrack(i, autoplay = true) {
  const t = TRACKS[i];
  if (!t || !audioEl) return;

  audioEl.src = t.file;
  audioEl.load();

  if (trackNow) trackNow.textContent = t.title;

  if (autoplay) {
    audioEl.play().catch(() => {
      // autoplay might be blocked until user interaction (normal)
    });
  }
}

function toggleAudio() {
  if (!audioEl) return;
  if (audioEl.paused) audioEl.play().catch(() => {});
  else audioEl.pause();
}

// click on a track (mouse)
if (trackList) {
  trackList.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-i]");
    if (!li) return;
    const i = Number(li.getAttribute("data-i"));
    setTrackIndex(i);
    playTrack(i, true);
  });
}

// initial render
renderTrackList();

/**
 * ✅ FIX: Play/Pause ALWAYS goes to music (now-playing-1), not menu.
 * Then toggles audio.
 */
btnPlay.addEventListener('click', () => {
  secret.registerButton('play');

  // Always show the music page when Play/Pause is pressed
  if (nav.currentViewId !== 'now-playing-1') {
    nav.setActiveView('now-playing-1');
  }

  // Then toggle audio
  toggleAudio();
});

btnFW.addEventListener('click', () => {
  secret.registerButton('fw');

  // Main menu: cycle DOWN through links
  if (nav.currentViewId === 'main-menu') {
    const items = menuItems();
    if (!items.length) return;
    selectedIndex = (selectedIndex + 1) % items.length;
    updateMenuSelection();
    return;
  }

  // MP3 music page: cycle DOWN through tracks
  if (nav.currentViewId === 'now-playing-1') {
    setTrackIndex(trackIndex + 1);
    return;
  }

  nav.next();
});

btnRW.addEventListener('click', () => {
  secret.registerButton('rw');

  // Main menu: cycle UP through links
  if (nav.currentViewId === 'main-menu') {
    const items = menuItems();
    if (!items.length) return;
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    updateMenuSelection();
    return;
  }

  // MP3 music page: cycle UP through tracks
  if (nav.currentViewId === 'now-playing-1') {
    setTrackIndex(trackIndex - 1);
    return;
  }

  nav.prev();
});

btnCenter.addEventListener('click', () => {
  secret.registerButton('center');

  // Main menu: open selected streaming link
  if (nav.currentViewId === 'main-menu') {
    openSelectedMenuLink();
    return;
  }

  // MP3 music page: play selected track
  if (nav.currentViewId === 'now-playing-1') {
    playTrack(trackIndex, true);
    return;
  }
});

// Hit areas (add preventDefault so taps feel consistent on mobile)
hitMenu.addEventListener('click', (e) => { e.preventDefault(); btnMenu.click(); });
hitRW.addEventListener('click', (e) => { e.preventDefault(); btnRW.click(); });
hitFW.addEventListener('click', (e) => { e.preventDefault(); btnFW.click(); });
hitPlay.addEventListener('click', (e) => { e.preventDefault(); btnPlay.click(); });

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (isEditableTarget(e.target)) return;

  if (key === 'm') {
    e.preventDefault();
    btnMenu.click();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    btnRW.click();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    btnFW.click();
  } else if (key === 'p' || e.code === 'Space') {
    e.preventDefault();
    btnPlay.click();
  }
});

// Init feature modules
initAlbums();
initForm(nav);

// Ensure main menu selection state is correct on load
updateMenuSelection();