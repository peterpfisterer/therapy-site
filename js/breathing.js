const orb = document.getElementById('orb');
const label = document.getElementById('breath-label');
const btn = document.getElementById('breath-toggle');

const phaseDuration = 3000;
const popDuration = 1100;
const startingScale = 0.85;
const largestScale = 2.35;
let timer = null;
let scale = startingScale;
let phase = 'in';

function setScale(nextScale) {
  scale = Math.max(0.55, Math.min(largestScale, nextScale));
  orb.style.setProperty('--orb-scale', scale);
}

function breathe() {
  if (phase === 'in') {
    orb.classList.remove('out');
    orb.classList.add('in');
    setScale(scale * 0.84);
    label.textContent = 'Breathe in — the bubble gets smaller';
    phase = 'out';
    timer = setTimeout(breathe, phaseDuration);
    return;
  }

  orb.classList.remove('in');
  orb.classList.add('out');
  const nextScale = scale * 1.55;
  if (nextScale >= largestScale) {
    setScale(largestScale);
    label.textContent = 'Breathe out…';
    timer = setTimeout(popBubble, phaseDuration);
    return;
  }

  setScale(nextScale);
  label.textContent = 'Breathe out — the bubble gets bigger';
  phase = 'in';
  timer = setTimeout(breathe, phaseDuration);
}

function popBubble() {
  orb.classList.remove('in', 'out');
  orb.classList.add('popping');
  label.textContent = 'Pop! A new bubble is ready.';
  timer = setTimeout(() => {
    orb.classList.remove('popping');
    setScale(startingScale);
    phase = 'in';
    timer = setTimeout(breathe, 500);
  }, popDuration);
}

function stopBreathing() {
  clearTimeout(timer);
  timer = null;
  orb.classList.remove('in', 'out', 'popping');
  setScale(1);
  label.textContent = 'Nice breathing!';
  btn.textContent = 'Start breathing';
}

btn.addEventListener('click', () => {
  if (timer) {
    stopBreathing();
    return;
  }
  phase = 'in';
  setScale(startingScale);
  btn.textContent = 'Stop breathing';
  breathe();
});
