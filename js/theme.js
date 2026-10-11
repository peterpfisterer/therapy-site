// Runs in <head> so the saved theme applies before first paint
try {
  const t = localStorage.getItem('cc.theme');
  if (t) document.documentElement.dataset.theme = t;
} catch {}
