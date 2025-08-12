// navigation.js
const publicViews = ['main-menu','album-1','album-2','info'];
const nowPlayingViews = ['now-playing-1','now-playing-2','now-playing-3'];

export function createNavigation() {
  let currentViewId = 'main-menu';
  let currentPublicIndex = 0;
  let currentNowPlayingIndex = 0;

  function setActiveView(targetId) {
    if (targetId === currentViewId) return;
    const currentEl = document.getElementById(currentViewId);
    const nextEl = document.getElementById(targetId);
    if (!nextEl) return;
    // If leaving secret, let secret module reset itself via event
    currentEl?.classList.remove('active');
    nextEl.classList.add('active');
    document.getElementById('title').textContent = nextEl.getAttribute('data-title') || 'Goodymoog Player';
    currentViewId = targetId;
    document.dispatchEvent(new CustomEvent('viewchange', { detail: { id: currentViewId } }));
  }

  function showPublicByIndex(i) {
    const n = (i + publicViews.length) % publicViews.length;
    currentPublicIndex = n;
    setActiveView(publicViews[n]);
  }

  function showNowPlayingByIndex(i) {
    const n = (i + nowPlayingViews.length) % nowPlayingViews.length;
    currentNowPlayingIndex = n;
    setActiveView(nowPlayingViews[n]);
  }

  function isNowPlaying() {
    return currentViewId.startsWith('now-playing');
  }

  return {
    get currentViewId() { return currentViewId; },
    setActiveView,
    showPublicByIndex,
    showNowPlayingByIndex,
    next: () => isNowPlaying() ? showNowPlayingByIndex(currentNowPlayingIndex + 1) : showPublicByIndex(currentPublicIndex + 1),
    prev: () => isNowPlaying() ? showNowPlayingByIndex(currentNowPlayingIndex - 1) : showPublicByIndex(currentPublicIndex - 1),
    resetToMenu: () => { currentPublicIndex = 0; setActiveView('main-menu'); }
  };
}
