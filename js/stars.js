const KEY = 'cc.goals';
const list = document.getElementById('goals');
const form = document.getElementById('goal-form');
const input = document.getElementById('goal-input');
const cheer = document.getElementById('cheer');

let goals = store.get(KEY, [
  { text: 'Try something new', done: false },
  { text: 'Use my calm breaths', done: false },
]);

function save() { store.set(KEY, goals); }

function dropConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#f6a9c5', '#f8d86b', '#9bcaf0', '#9bd8bd', '#c7a9e8'];
  const pieces = Array.from({ length: 100 }, () => {
    const piece = document.createElement('span');
    piece.className = Math.random() < 0.25 ? 'confetti-piece round' : 'confetti-piece';
    piece.style.setProperty('--confetti-x', `${Math.random() * 100}%`);
    piece.style.setProperty('--confetti-drift', `${Math.round(Math.random() * 180 - 90)}px`);
    piece.style.setProperty('--confetti-delay', `${(Math.random() * 0.25).toFixed(2)}s`);
    piece.style.setProperty('--confetti-duration', `${(1.5 + Math.random()).toFixed(2)}s`);
    piece.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
    piece.addEventListener('animationend', () => piece.remove(), { once: true });
    return piece;
  });

  document.body.append(...pieces);
}

function render() {
  list.replaceChildren(...goals.map((g, idx) => {
    const li = document.createElement('li');
    li.className = 'card';

    const name = document.createElement('strong');
    name.textContent = g.text;

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-row';
    star.textContent = g.done ? 'Undo' : 'Done!';
    star.setAttribute('aria-pressed', String(g.done));
    star.setAttribute('aria-label', g.done ? `Undo ${g.text}` : `Mark ${g.text} done`);
    star.addEventListener('click', () => {
      g.done = !g.done;
      save();
      render();
      if (g.done) {
        dropConfetti();
        cheer.textContent = 'Well done!';
        cheer.classList.remove('show');
        void cheer.offsetWidth;
        cheer.classList.add('show');
      }
    });

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn secondary';
    del.textContent = 'Remove';
    del.setAttribute('aria-label', `Remove ${g.text}`);
    del.addEventListener('click', () => { goals.splice(idx, 1); save(); render(); });

    const right = document.createElement('div');
    right.style.cssText = 'display:flex;align-items:center;gap:1rem';
    right.append(star, del);
    li.append(name, right);
    return li;
  }));
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  goals.push({ text, done: false });
  input.value = '';
  save();
  render();
});

render();
