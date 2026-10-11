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

function render() {
  list.replaceChildren(...goals.map((g, idx) => {
    const li = document.createElement('li');
    li.className = 'card';

    const name = document.createElement('strong');
    name.textContent = g.text;

    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'star-row';
    star.textContent = '⭐';
    star.setAttribute('aria-pressed', String(g.done));
    star.setAttribute('aria-label', `Star for ${g.text}`);
    star.addEventListener('click', () => {
      g.done = !g.done;
      save();
      render();
      if (g.done) {
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
