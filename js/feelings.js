const KEY = 'cc.feelings';
const replies = {
  Happy: 'Yay! Happy is a great feeling to have.',
  Calm: 'Nice and peaceful. Enjoy it.',
  Sad: 'It is okay to feel sad. Tell a grown-up you trust, or try the Calm Bubble.',
  Angry: 'Angry feelings are big. Try the Calm Bubble and take some slow breaths.',
  Scared: 'You are safe. Talk to a grown-up, or try the Calm Bubble.',
  Tired: 'Rest is important. Take it easy.',
};

const form = document.getElementById('feeling-form');
const reply = document.getElementById('feeling-reply');
const list = document.getElementById('history');

function render() {
  const items = store.get(KEY, []);
  list.replaceChildren(...(items.length
    ? items.slice(-10).reverse().map(i => {
        const li = document.createElement('li');
        li.textContent = `${i.emoji} ${i.value} · ${new Date(i.at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`;
        return li;
      })
    : Object.assign(document.createElement('li'), { textContent: 'Nothing yet' })));
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const picked = form.querySelector('input[name="feeling"]:checked');
  if (!picked) { reply.textContent = 'Tap a face first.'; return; }
  const items = store.get(KEY, []);
  items.push({ value: picked.value, emoji: picked.dataset.emoji, at: Date.now() });
  store.set(KEY, items);
  reply.textContent = replies[picked.value];
  render();
});

document.getElementById('clear').addEventListener('click', () => {
  localStorage.removeItem(KEY);
  render();
});

render();
