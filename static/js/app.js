(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const LEVELS = ['', 'Learning', 'Basic', 'Comfortable', 'Confident', 'Strong'];
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    }
    kids.flat().forEach(c => c && n.append(c));
    return n;
  };
  const api = async (url, opts) => {
    const r = await fetch(url, opts);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || 'Request failed'), { data: j });
    return j;
  };
  const fail = (box) => box.replaceChildren(el('p', { class: 'note', text: 'Could not load this section. ' }, el('button', { class: 'btn', type: 'button', text: 'Retry' })));
  const guard = async (box, fn) => { try { await fn(); } catch { fail(box); const b = $('button', box); if (b) b.onclick = () => guard(box, fn); } };

  const root = document.documentElement;
  $('#theme').onclick = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next; try { localStorage.setItem('theme', next); } catch {}
  };
  const menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => burger.setAttribute('aria-expanded', menu.classList.toggle('open'));
  menu.onclick = e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } };

  const loadProfile = async () => {
    const p = await api('/api/profile');
    $('#h-name').textContent = p.name; $('#h-role').textContent = p.role; $('#h-tag').textContent = p.tagline;
    $('#about-text').textContent = p.about; $('#goal').textContent = p.goal; $('#loc').textContent = '📍 ' + p.location;
    $('#gh-link').href = $('#gh-cta').href = p.github;
    $('#soft').replaceChildren(...p.soft_skills.map(s => el('li', { text: s })));
    $('#edu').replaceChildren(...p.education.map(e => el('div', { class: 'card' }, el('h3', { text: e.degree }), el('p', { text: e.institution }), el('p', { text: e.detail }))));
  };

  const loadSkills = async () => {
    const data = await api('/api/skills');
    $('#skills-grid').replaceChildren(...data.map(g => el('div', { class: 'card' }, el('h3', { text: g.category }),
      g.items.map(i => el('div', { class: 'skill' }, el('span', { text: i.name }), el('em', { text: LEVELS[i.level] }),
        el('div', { class: 'bar', role: 'img', 'aria-label': `${i.name}: ${LEVELS[i.level]}` }, el('i', { 'data-w': i.level * 20 })))))));
    requestAnimationFrame(() => setTimeout(() => document.querySelectorAll('.bar i').forEach(b => b.style.width = b.dataset.w + '%'), 100));
  };

  let projects = [], filter = 'All', query = '';
  const FILTERS = { All: () => true, Featured: p => p.featured, Python: p => p.tech.includes('Python'), JavaScript: p => p.tech.includes('JavaScript') || p.tech.includes('TypeScript'), React: p => p.tech.includes('React') };
  const renderProjects = () => {
    const q = query.toLowerCase();
    const list = projects.filter(FILTERS[filter]).filter(p => (p.name + p.description + p.tech.join(' ')).toLowerCase().includes(q));
    const grid = $('#projects-grid');
    if (!list.length) return grid.replaceChildren(el('p', { class: 'note', text: 'No projects match. Try a different search or filter.' }));
    grid.replaceChildren(...list.map(p => el('article', { class: 'card' },
      p.featured && el('span', { class: 'feat', text: 'Featured' }),
      el('h3', { text: p.name }), el('p', { text: p.description }),
      el('ul', { class: 'chips' }, p.tech.map(t => el('li', { text: t }))),
      el('div', { class: 'links' },
        el('a', { href: p.github, target: '_blank', rel: 'noopener', 'aria-label': `${p.name} on GitHub`, text: 'GitHub ↗' }),
        p.live_url && el('a', { href: p.live_url, target: '_blank', rel: 'noopener', 'aria-label': `${p.name} live demo`, text: 'Live Demo ↗' })))))
  };
  const loadProjects = async () => {
    projects = await api('/api/projects');
    $('#count').textContent = projects.length + '+';
    $('#filters').replaceChildren(...Object.keys(FILTERS).map(f => el('button', { type: 'button', 'aria-pressed': String(f === filter), text: f })));
    renderProjects();
  };
  $('#filters').onclick = e => { if (e.target.tagName !== 'BUTTON') return; filter = e.target.textContent; document.querySelectorAll('#filters button').forEach(b => b.setAttribute('aria-pressed', String(b === e.target))); renderProjects(); };
  $('#q').oninput = e => { query = e.target.value.trim(); renderProjects(); };

  const form = $('#form'), status = $('#form-status');
  const setErrors = (errs = {}) => ['name', 'email', 'message'].forEach(k => $('#e-' + k).textContent = errs[k] || '');
  form.onsubmit = async e => {
    e.preventDefault(); setErrors(); status.className = ''; status.textContent = '';
    const body = Object.fromEntries(new FormData(form)), errs = {};
    if (body.name.trim().length < 2) errs.name = 'Enter your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email.trim())) errs.email = 'Enter a valid email address.';
    if (body.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    if (Object.keys(errs).length) return setErrors(errs);
    const btn = $('button', form); btn.disabled = true;
    try { const r = await api('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); status.className = 'ok'; status.textContent = r.message; form.reset(); }
    catch (err) { if (err.data && err.data.errors) setErrors(err.data.errors); status.className = 'bad'; status.textContent = 'Message not sent. Please check the form and try again.'; }
    finally { btn.disabled = false; }
  };

  const resume = $('#resume');
  resume.onclick = async e => { e.preventDefault(); const msg = $('#resume-msg'); try { const r = await fetch(resume.getAttribute('href'), { method: 'HEAD' }); if (!r.ok) throw 0; window.open(resume.href, '_blank'); } catch { msg.hidden = false; msg.textContent = 'Resume will be available soon. Please use the contact form in the meantime.'; } };

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .08 }) : null;
  document.querySelectorAll('.reveal').forEach(s => io ? io.observe(s) : s.classList.add('in'));
  $('#yr').textContent = new Date().getFullYear();
  guard($('#skills-grid'), loadSkills); guard($('#projects-grid'), loadProjects); guard($('#edu'), loadProfile);
})();