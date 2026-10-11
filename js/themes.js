const THEMES = [
  { id: '', name: 'Rainbow', swatch: 'linear-gradient(135deg, #b9a4ff, #ffe27a)' },
  { id: 'ocean', name: 'Ocean', swatch: 'linear-gradient(135deg, #3b9cdc, #a8e6e0)' },
  { id: 'forest', name: 'Forest', swatch: 'linear-gradient(135deg, #3aa36b, #cfe99a)' },
  { id: 'sunset', name: 'Sunset', swatch: 'linear-gradient(135deg, #ee6c3c, #f7b7cf)' },
  { id: 'night', name: 'Night', swatch: 'linear-gradient(135deg, #2c2a5a, #8d7be8)' },
];

const picker = document.createElement('div');
picker.className = 'themes';
picker.setAttribute('role', 'group');
picker.setAttribute('aria-label', 'Choose a colour theme');

const buttons = THEMES.map(t => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'theme-btn';
  b.style.setProperty('--swatch', t.swatch);
  b.title = t.name;
  b.setAttribute('aria-label', t.name);
  b.addEventListener('click', () => apply(t.id));
  picker.append(b);
  return b;
});

function apply(id) {
  if (id) document.documentElement.dataset.theme = id;
  else delete document.documentElement.dataset.theme;
  try { id ? localStorage.setItem('cc.theme', id) : localStorage.removeItem('cc.theme'); } catch {}
  buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(THEMES[i].id === id)));
}

apply(document.documentElement.dataset.theme ?? '');
document.querySelector('.site-header .wrap')?.append(picker);
