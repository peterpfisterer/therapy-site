const orb = document.getElementById('orb');
const label = document.getElementById('breath-label');
const btn = document.getElementById('breath-toggle');

// in 4s, hold 1s, out 4s
const steps = [
  { cls: 'in', text: 'Breathe in…', ms: 4000 },
  { cls: 'hold', text: 'Hold', ms: 1000 },
  { cls: 'out', text: 'Breathe out…', ms: 4000 },
];
let timer = null;
let i = 0;

function tick() {
  const s = steps[i % steps.length];
  orb.className = `orb ${s.cls}`;
  label.textContent = s.text;
  i++;
  timer = setTimeout(tick, s.ms);
}

btn.addEventListener('click', () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    orb.className = 'orb';
    label.textContent = 'Great job!';
    btn.textContent = 'Start';
  } else {
    i = 0;
    btn.textContent = 'Stop';
    tick();
  }
});
