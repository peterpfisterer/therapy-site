const BASE = 'assets/dog-feelings';
const KINDS = {
  // box fits every eye image into the same size, in puppy-region pixels
  eyes: { count: 14, file: n => `${BASE}/eyes/eyes-${n}.png`, box: [150, 105], home: [245, 150], label: 'Eyes' },
  mouths: { count: 12, file: n => `${BASE}/mouths/mouth-${n}.png`, scale: 0.3, home: [245, 250], label: 'Mouth' },
};
// Puppy occupies this top-left region of body.png (pixels)
const CROP_W = 460;
const CROP_H = 545;

const stage = document.getElementById('dog-stage');
const placed = { eyes: null, mouths: null };
const sizeFactor = { eyes: 1, mouths: 1 };

const widthPct = (kind, img) => {
  const { box, scale } = KINDS[kind];
  return ((box ? box[0] : (img.naturalWidth || 400) * scale) / CROP_W) * 100 * sizeFactor[kind];
};

function fitBox(kind, el) {
  const { box } = KINDS[kind];
  if (!box) return;
  el.style.aspectRatio = `${box[0]} / ${box[1]}`;
  el.style.objectFit = 'contain';
}

function removePlaced(kind) {
  placed[kind]?.remove();
  placed[kind] = null;
}

function place(kind, src, xPct, yPct) {
  removePlaced(kind);
  const img = document.createElement('img');
  img.className = 'sticker';
  img.src = src;
  img.draggable = false;
  img.tabIndex = 0;
  img.alt = `${KINDS[kind].label} on the puppy`;
  img.dataset.kind = kind;
  img.style.left = `${xPct}%`;
  img.style.top = `${yPct}%`;
  img.style.width = `${widthPct(kind, img)}%`;
  fitBox(kind, img);
  img.addEventListener('load', () => { img.style.width = `${widthPct(kind, img)}%`; });
  img.addEventListener('pointerdown', e => startDrag(e, kind, img));
  img.addEventListener('keydown', e => {
    const step = 2;
    const x = parseFloat(img.style.left);
    const y = parseFloat(img.style.top);
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      img.style.left = `${Math.min(100, Math.max(0, x + moves[e.key][0]))}%`;
      img.style.top = `${Math.min(100, Math.max(0, y + moves[e.key][1]))}%`;
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      removePlaced(kind);
    }
  });
  stage.append(img);
  placed[kind] = img;
  return img;
}

function startDrag(e, kind, source) {
  if (e.button > 0) return;
  e.preventDefault();

  const existing = source.classList.contains('sticker') ? source : null;
  const stageRect = stage.getBoundingClientRect();
  const src = existing ? existing.src : source.querySelector('img').src;
  const natural = existing ?? source.querySelector('img');

  const ghost = document.createElement('img');
  ghost.className = 'drag-ghost';
  ghost.src = src;
  ghost.style.width = `${(widthPct(kind, natural) / 100) * stageRect.width}px`;
  fitBox(kind, ghost);
  document.body.append(ghost);
  existing?.classList.add('dragging');

  const move = ev => {
    if (ev.pointerId !== e.pointerId) return;
    ghost.style.left = `${ev.clientX}px`;
    ghost.style.top = `${ev.clientY}px`;
  };
  const end = ev => {
    if (ev.pointerId !== e.pointerId) return;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
    ghost.remove();
    existing?.classList.remove('dragging');

    const r = stage.getBoundingClientRect();
    const inside = ev.type === 'pointerup'
      && ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
    if (inside) {
      place(kind, src, ((ev.clientX - r.left) / r.width) * 100, ((ev.clientY - r.top) / r.height) * 100);
    } else if (existing) {
      removePlaced(kind);
    }
  };

  move(e);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
}

for (const [kind, cfg] of Object.entries(KINDS)) {
  const tray = document.getElementById(`${kind}-tray`);
  for (let n = 1; n <= cfg.count; n++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `${cfg.label} ${n}`);
    const img = document.createElement('img');
    img.src = cfg.file(n);
    img.alt = '';
    img.draggable = false;
    btn.append(img);
    btn.addEventListener('pointerdown', e => startDrag(e, kind, btn));
    // detail === 0 means keyboard activation; pointer users drag instead
    btn.addEventListener('click', e => {
      if (e.detail !== 0) return;
      place(kind, img.src, (cfg.home[0] / CROP_W) * 100, (cfg.home[1] / CROP_H) * 100);
    });
    tray.append(btn);
  }
}

document.getElementById('dog-reset').addEventListener('click', () => {
  removePlaced('eyes');
  removePlaced('mouths');
  for (const kind of Object.keys(KINDS)) setSize(kind, 100);
});

function setSize(kind, percent) {
  sizeFactor[kind] = percent / 100;
  document.getElementById(`${kind}-size`).value = percent;
  if (placed[kind]) placed[kind].style.width = `${widthPct(kind, placed[kind])}%`;
}

for (const kind of Object.keys(KINDS)) {
  document.getElementById(`${kind}-size`).addEventListener('input', e => setSize(kind, Number(e.target.value)));
}
