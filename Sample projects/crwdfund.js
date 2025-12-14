// --- Simple Crowdfunding Demo ---
// Data model stored in localStorage
const LS_KEY = 'crowdfundr_v1';

// App state
const state = {
  projects: [],
  selectedProjectId: null
};

// Utility: format INR
const formatINR = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹${value}`;
  }
};

// Utility: id
const uid = () => Math.random().toString(36).slice(2, 10);

// Storage
function save() {
  localStorage.setItem(LS_KEY, JSON.stringify(state.projects));
}
function load() {
  const raw = localStorage.getItem(LS_KEY);
  state.projects = raw ? JSON.parse(raw) : seed();
}

// Seed demo data
function seed() {
  const demo = [
    {
      id: uid(),
      title: 'Solar kits for village schools',
      description: 'Help us equip rural schools with solar-powered lights and chargers to improve study conditions.',
      category: 'community',
      goal: 250000,
      raised: 75000,
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      updates: [
        { id: uid(), title: 'Pilot school selected', body: 'We chose a school in Theni district for the first installation.', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 }
      ],
      backers: [
        { id: uid(), name: 'Anonymous', amount: 5000, message: 'Great cause!', createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2 }
      ]
    },
    {
      id: uid(),
      title: 'Indie puzzle game “Glyph”',
      description: 'A calm, atmospheric puzzle game for mobile with handcrafted levels and ambient music.',
      category: 'games',
      goal: 150000,
      raised: 42000,
      image: 'https://images.unsplash.com/photo-1522199755839-a2a3bffb0e4c?q=80&w=1200&auto=format&fit=crop',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      updates: [],
      backers: []
    },
    {
      id: uid(),
      title: 'Open-source Tamil OCR',
      description: 'High-accuracy OCR models for printed Tamil text, released under permissive license.',
      category: 'tech',
      goal: 400000,
      raised: 98000,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      updates: [],
      backers: []
    }
  ];
  return demo;
}

// Elements
const projectGrid = document.getElementById('projectGrid');
const newProjectBtn = document.getElementById('newProjectBtn');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');

const detailModal = document.getElementById('detailModal');
const detailContent = document.getElementById('detailContent');

const contribModal = document.getElementById('contribModal');
const contribForm = document.getElementById('contribForm');

const updateModal = document.getElementById('updateModal');
const updateForm = document.getElementById('updateForm');

const statProjects = document.getElementById('statProjects');
const statRaised = document.getElementById('statRaised');
const statBackers = document.getElementById('statBackers');

// Modal helpers
function openModal(el) { el.classList.remove('hidden'); }
function closeModal(el) { el.classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    [projectModal, detailModal, contribModal, updateModal].forEach(m => m.classList.add('hidden'));
  });
});

// Render projects
function renderProjects() {
  const filter = categoryFilter.value;
  const q = searchInput.value.trim().toLowerCase();

  let list = [...state.projects];
  if (filter !== 'all') list = list.filter(p => p.category === filter);
  if (q) list = list.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  projectGrid.innerHTML = list.map(p => projectCardHTML(p)).join('');
  renderStats();
}

function projectCardHTML(p) {
  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  return `
    <article class="card">
      <img src="${p.image || 'https://images.unsplash.com/photo-1522199755839-a2a3bffb0e4c?q=80&w=1200&auto=format&fit=crop'}" alt="">
      <div class="card-body">
        <h3 class="card-title">${escapeHTML(p.title)}</h3>
        <p class="card-desc">${escapeHTML(p.description.slice(0, 140))}${p.description.length > 140 ? '…' : ''}</p>
        <div class="card-meta">
          <span>${formatINR(p.raised)} raised</span>
          <span>${formatINR(p.goal)} goal</span>
        </div>
        <div class="progress"><span style="width:${pct}%;"></span></div>
      </div>
      <div class="card-actions">
        <button class="btn primary" data-open-detail="${p.id}">View details</button>
        <button class="btn success" data-open-contrib="${p.id}">Contribute</button>
      </div>
    </article>
  `;
}

// Escape HTML for user inputs
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[s]);
}

// Stats
function renderStats() {
  const totalProjects = state.projects.length;
  const totalRaised = state.projects.reduce((sum, p) => sum + (p.raised || 0), 0);
  const totalBackers = state.projects.reduce((sum, p) => sum + (p.backers?.length || 0), 0);

  statProjects.textContent = totalProjects;
  statRaised.textContent = formatINR(totalRaised);
  statBackers.textContent = totalBackers;
}

// Event delegation for cards
projectGrid.addEventListener('click', (e) => {
  const detailId = e.target.getAttribute('data-open-detail');
  const contribId = e.target.getAttribute('data-open-contrib');
  if (detailId) openProject(detailId);
  if (contribId) openContrib(contribId);
});

// Create project
newProjectBtn.addEventListener('click', () => {
  projectForm.reset();
  openModal(projectModal);
});
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(projectForm);
  const title = fd.get('title').trim();
  const description = fd.get('description').trim();
  const category = fd.get('category');
  const goal = parseInt(fd.get('goal'), 10);
  const image = fd.get('image').trim();

  if (!title || !description || !category || !goal || goal < 100) {
    alert('Please fill all required fields with valid values.');
    return;
  }

  const project = {
    id: uid(),
    title, description, category,
    goal, raised: 0,
    image,
    createdAt: Date.now(),
    updates: [],
    backers: []
  };
  state.projects.unshift(project);
  save();
  renderProjects();
  closeModal(projectModal);
  openProject(project.id);
});

// Open project detail
function openProject(id) {
  state.selectedProjectId = id;
  const p = state.projects.find(x => x.id === id);
  if (!p) return;

  const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
  const updatesHTML = p.updates.length
    ? p.updates
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(u => `
          <div class="timeline-item">
            <h4>${escapeHTML(u.title)}</h4>
            <p>${escapeHTML(u.body)}</p>
            <small class="muted">${new Date(u.createdAt).toLocaleString()}</small>
          </div>
        `).join('')
    : '<p class="hint">No updates yet.</p>';

  const backersHTML = p.backers.length
    ? p.backers
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(b => `
          <div class="backer">
            <span>${escapeHTML(b.name || 'Anonymous')}</span>
            <span>${formatINR(b.amount)}</span>
          </div>
        `).join('')
    : '<p class="hint">No backers yet. Be the first!</p>';

  detailContent.innerHTML = `
    <div class="detail-header">
      <img src="${p.image || 'https://images.unsplash.com/photo-1522199755839-a2a3bffb0e4c?q=80&w=1200&auto=format&fit=crop'}" alt="">
      <div class="detail-info">
        <h2>${escapeHTML(p.title)}</h2>
        <p>${escapeHTML(p.description)}</p>
        <div class="numbers">
          <strong>${formatINR(p.raised)}</strong> raised of <strong>${formatINR(p.goal)}</strong> goal
          <div class="progress" style="margin-top:8px;"><span style="width:${pct}%;"></span></div>
          <p style="margin-top:6px; color:#9ca3af;">Category: ${escapeHTML(p.category)}</p>
        </div>
        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn success" data-open-contrib="${p.id}">Contribute</button>
          <button class="btn primary" id="openUpdate">Post update</button>
          <button class="btn" data-close>Close</button>
        </div>
      </div>
    </div>

    <section>
      <h3>Updates</h3>
      <div class="timeline">${updatesHTML}</div>
    </section>

    <section class="backers-list">
      <h3>Recent backers</h3>
      ${backersHTML}
    </section>
  `;

  // Wire up buttons inside modal
  const contribBtn = detailContent.querySelector('[data-open-contrib]');
  if (contribBtn) contribBtn.addEventListener('click', () => openContrib(p.id));
  const openUpdateBtn = document.getElementById('openUpdate');
  if (openUpdateBtn) openUpdateBtn.addEventListener('click', () => {
    updateForm.reset();
    openModal(updateModal);
  });

  openModal(detailModal);
}

// Contribute flow (mock payment)
function openContrib(id) {
  state.selectedProjectId = id;
  contribForm.reset();
  openModal(contribModal);
}

contribForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const p = state.projects.find(x => x.id === state.selectedProjectId);
  if (!p) return;

  const fd = new FormData(contribForm);
  const name = fd.get('name').trim();
  const amount = parseInt(fd.get('amount'), 10);
  const message = fd.get('message').trim();

  if (!amount || amount < 50) {
    alert('Minimum contribution is ₹50.');
    return;
  }

  // Mock payment confirmation
  const confirmPay = confirm(`Proceed to pay ${formatINR(amount)}? (Demo confirmation)`);
  if (!confirmPay) return;

  const backer = { id: uid(), name, amount, message, createdAt: Date.now() };
  p.backers.push(backer);
  p.raised = (p.raised || 0) + amount;
  save();
  renderProjects();
  closeModal(contribModal);
  openProject(p.id);
});

// Add update
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const p = state.projects.find(x => x.id === state.selectedProjectId);
  if (!p) return;

  const fd = new FormData(updateForm);
  const title = fd.get('title').trim();
  const body = fd.get('body').trim();

  if (!title || !body) {
    alert('Please fill both fields.');
    return;
  }

  p.updates.push({ id: uid(), title, body, createdAt: Date.now() });
  save();
  closeModal(updateModal);
  openProject(p.id);
});

// Filters
categoryFilter.addEventListener('change', renderProjects);
searchInput.addEventListener('input', () => {
  // Debounce-ish
  clearTimeout(searchInput._t);
  searchInput._t = setTimeout(renderProjects, 200);
});

// Init
load();
renderProjects();
