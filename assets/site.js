/* Irshadify Meridian, multipage build.
   Enhancements only: every page works fully with this file absent. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }

  /* colour preview switcher (demo chrome, persisted) */
  var saved = store('irshadify-theme');
  if (saved) root.setAttribute('data-theme', saved);
  function markBtns() {
    var cur = root.getAttribute('data-theme');
    document.querySelectorAll('.sw-btn').forEach(function (x) {
      x.classList.toggle('on', x.getAttribute('data-set-theme') === cur);
    });
  }
  document.querySelectorAll('.sw-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      root.setAttribute('data-theme', b.getAttribute('data-set-theme'));
      store('irshadify-theme', b.getAttribute('data-set-theme'));
      markBtns();
    });
  });
  markBtns();

  /* mobile menu: close after choosing a link (the menu itself is CSS) */
  var navToggle = document.getElementById('navToggle');
  var dropToggle = document.getElementById('dropToggle');
  document.querySelectorAll('.m-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (navToggle) navToggle.checked = false;
      if (dropToggle) dropToggle.checked = false;
    });
  });

  /* reveals: directional fade-ins with a hard failsafe */
  function arm(el) { el.classList.add('in'); }
  var rvEls = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { arm(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(arm);
  }
  setTimeout(function () { rvEls.forEach(arm); }, 2800);

  /* illustrative mocks: mark as played when seen (cosmetic only) */
  var mocks = document.querySelectorAll('.mock');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('seen', 'played');
          io2.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });
    mocks.forEach(function (m) { io2.observe(m); });
  } else {
    mocks.forEach(function (m) { m.classList.add('seen', 'played'); });
  }

  /* blog category filter */
  document.querySelectorAll('.bf-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.bf-btn').forEach(function (x) { x.classList.toggle('on', x === b); });
      var cat = b.getAttribute('data-cat');
      document.querySelectorAll('.post-card').forEach(function (c) {
        c.style.display = (cat === 'all' || c.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });

  /* forms: validation + success state (same behaviour as the demo) */
  function wireForm(form) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var summary = form.querySelector('.err-summary');
      if (summary) summary.style.display = 'none';
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = false;
        if (f.type === 'checkbox') { bad = !f.checked; }
        else {
          var v = (f.value || '').trim();
          bad = !v;
          if (!bad && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) bad = true;
          if (!bad && f.type === 'url' && !/^https?:\/\/.+\..+/.test(v)) bad = true;
        }
        f.classList.toggle('bad', bad);
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        if (summary) summary.style.display = 'block';
        firstBad.focus();
        return;
      }
      var ok = form.querySelector('.form-ok');
      if (ok) {
        var nm = form.querySelector('[name="fullname"]');
        var b = ok.querySelector('b');
        if (b && nm && nm.value.trim()) b.textContent = 'Thank you, ' + nm.value.trim().split(' ')[0] + '.';
        ok.style.display = 'block';
        if (ok.scrollIntoView) ok.scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
      }
      form.reset();
    });
    form.querySelectorAll('input,select,textarea').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('bad'); });
      f.addEventListener('change', function () { f.classList.remove('bad'); });
    });
  }
  wireForm(document.querySelector('.cform'));
  wireForm(document.querySelector('.eoiform'));

  /* cookie consent is NOT here on purpose: it ships as its own
     standalone script (CONSENT_JS in the generator) that creates the
     banner itself, so a failure anywhere in this file can never
     leave a dead banner on the page. */
})();
