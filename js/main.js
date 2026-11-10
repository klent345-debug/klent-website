const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Mobile menu ===== */
const navToggle = $('#navToggle');
const nav = $('#nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', false); }
});

/* ===== Typing effect (edit the roles here) ===== */
const roles = ['data technician', 'IT support specialist', 'lifelong learner'];
const typingEl = $('#typing');
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  typingEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; return setTimeout(type, 90); }
  if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  if (c > 0) { c--; return setTimeout(type, 45); }
  deleting = false; r = (r + 1) % roles.length; setTimeout(type, 300);
}
if (typingEl) { reduceMotion ? (typingEl.textContent = roles[0]) : type(); }

/* ===== Trainings / seminars filter ===== */
const tabs = $$('.tab');
const items = $$('#learnList li');
items.forEach(li => {
  const t = li.dataset.type;
  $('h3', li).insertAdjacentHTML('beforeend', `<span class="badge ${t}">${t}</span>`);
});
tabs.forEach(tab => {
  const f = tab.dataset.filter;
  const n = f === 'all' ? items.length : items.filter(li => li.dataset.type === f).length;
  tab.insertAdjacentHTML('beforeend', `<span class="count">${n}</span>`);
});
function applyFilter(f) {
  let n = 0;
  items.forEach(li => {
    const show = f === 'all' || li.dataset.type === f;
    li.hidden = !show;
    li.classList.remove('pop');
    if (show) {
      void li.offsetWidth; // restart the animation
      li.style.animationDelay = (n++ * 70) + 'ms';
      li.classList.add('pop');
    }
  });
}
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
  applyFilter(tab.dataset.filter);
}));
applyFilter('all');

/* ===== FAQ accordion ===== */
$$('.acc-btn').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.parentElement.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}));

/* ===== Contact form: opens the visitor's email app (change the address) ===== */
const MY_EMAIL = 'juan@example.com';
const form = $('#contactForm');
const note = $('#formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const name = d.get('name').trim(), email = d.get('email').trim(), msg = d.get('message').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
    note.textContent = 'Enter your name, a valid email and a message.';
    form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
    return;
  }
  const body = encodeURIComponent(`${msg}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${body}`;
  note.textContent = 'Opening your email app. Thanks for reaching out!';
  form.reset();
});

/* ===== Click ripple on every button / clickable option ===== */
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('.btn,.tab,.acc-btn,.nav-toggle,.social a,.to-top');
  if (!el || reduceMotion) return;
  const b = el.getBoundingClientRect(), s = Math.max(b.width, b.height);
  const dot = document.createElement('span');
  dot.className = 'ripple';
  dot.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - b.left - s / 2}px;top:${e.clientY - b.top - s / 2}px`;
  el.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
});

/* ===== Scroll: progress bar, back-to-top, active nav link ===== */
const bar = $('#progress'), toTop = $('#toTop');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (scrollY / (h.scrollHeight - innerHeight) * 100) + '%';
  toTop.classList.toggle('show', scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

if ('IntersectionObserver' in window) {
  const links = $$('#nav a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });

  /* ===== Reveal on scroll ===== */
  if (!reduceMotion) {
    const els = $$('.card,.job,.proj-grid figure,.acc-item,.facts li,.about-grid>*,.sec h2,blockquote');
    els.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 80 + 'ms'; });
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in'); io.unobserve(el);
      setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1100);
    }), { threshold: .12 });
    els.forEach(el => io.observe(el));
  }
}

/* ===== Footer year ===== */
$('#year').textContent = new Date().getFullYear();
