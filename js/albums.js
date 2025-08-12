// albums.js
async function fetchAlbumFromAppleMusicUrl(url) {
  const m = url.match(/\/album\/[^/]+\/(\d+)/);
  if (!m) throw new Error('Album ID not found: ' + url);
  const id = m[1];
  const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=album`);
  if (!res.ok) throw new Error('Lookup failed ' + id);
  const data = await res.json();
  const album = data.results?.find(r => r.collectionType === 'Album') || data.results?.[0];
  if (!album) throw new Error('No album data ' + id);
  const artwork = (album.artworkUrl100 || '').replace('100x100bb','600x600bb');
  return { title: album.collectionName, artist: album.artistName, artwork, url };
}

export async function hydrateAlbum(viewId, imgId, captionId) {
  const el = document.getElementById(viewId);
  const url = el?.getAttribute('data-album-url');
  if (!url) return;
  try {
    const meta = await fetchAlbumFromAppleMusicUrl(url);
    const img = document.getElementById(imgId);
    const caption = document.getElementById(captionId);
    if (img) {
      img.src = meta.artwork;
      img.alt = `${meta.title} — ${meta.artist}`;
      img.decoding = 'async';
      img.loading = 'lazy';
    }
    if (caption) caption.textContent = meta.title;
    el.setAttribute('data-title', `Album: ${meta.title}`);
  } catch (e) {
    console.warn('Album hydrate failed:', e);
  }
}

export function initAlbums() {
  hydrateAlbum('album-1','album-1-img','album-1-caption');
  hydrateAlbum('album-2','album-2-img','album-2-caption');

  // Album 1 → YouTube channel
  const a1 = document.getElementById('album-1');
  if (a1) {
    a1.addEventListener('click', () => window.open('https://www.youtube.com/@goodymoog','_blank'));
  }
}
