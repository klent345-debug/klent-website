/* ===== Mobile menu ===== */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', false); }
});

/* ===== Typing effect (edit the roles here) ===== */
const roles = ['web developer', 'IT support specialist', 'lifelong learner'];
const typingEl = document.getElementById('typing');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typingEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; return setTimeout(type, 90); }
  if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  if (c > 0) { c--; return setTimeout(type, 45); }
  deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300);
}
reduceMotion ? (typingEl.textContent = roles[0]) : type();

/* ===== Trainings / seminars filter ===== */
const tabs = document.querySelectorAll('.tab');
const items = document.querySelectorAll('#learnList li');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
  const f = tab.dataset.filter;
  items.forEach(li => { li.hidden = f !== 'all' && li.dataset.type !== f; });
}));

/* ===== FAQ accordion ===== */
document.querySelectorAll('.acc-btn').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.parentElement.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}));

/* ===== Contact form: opens the visitor's email app (change the address) ===== */
const MY_EMAIL = 'juan@example.com';
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const name = d.get('name').trim(), email = d.get('email').trim(), msg = d.get('message').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
    note.textContent = 'Enter your name, a valid email and a message.';
    return;
  }
  const body = encodeURIComponent(`${msg}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${body}`;
  note.textContent = 'Opening your email app. Thanks for reaching out!';
  form.reset();
});

/* ===== Footer year ===== */
document.getElementById('year').textContent = new Date().getFullYear();
