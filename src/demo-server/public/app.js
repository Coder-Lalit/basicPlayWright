const app = document.getElementById('app');

const state = {
  token: localStorage.getItem('demo-token') || '',
  section: 'login',
  users: [],
  products: [],
  search: '',
};

const render = () => {
  const loggedIn = Boolean(state.token);

  if (!loggedIn) {
    app.innerHTML = `
      <div class="auth-shell">
        <div class="auth-box">
          <h1>Enterprise Demo</h1>
          <p>Sign in with the QA account.</p>
          <form id="login-form" class="form-grid">
            <label>
              Username
              <input id="username" name="username" value="admin" data-testid="username-input" required />
            </label>
            <label>
              Password
              <input id="password" name="password" type="password" value="admin123" data-testid="password-input" required />
            </label>
            <button type="submit" class="primary" data-testid="login-button">Log in</button>
          </form>
          <div id="login-error" class="hidden" data-testid="login-error"></div>
        </div>
      </div>
    `;
    attachLoginHandler();
    return;
  }

  app.innerHTML = `
    <header class="app-header">
      <div><strong>QA Automation Portal</strong></div>
      <nav>
        <a href="#" data-section="dashboard">Dashboard</a>
        <a href="#" data-section="users">Users</a>
        <a href="#" data-section="products">Products</a>
        <button class="secondary" id="logout-button" data-testid="logout-button">Log out</button>
      </nav>
    </header>
    <main class="container">
      <section id="dashboard" class="${state.section === 'dashboard' ? '' : 'hidden'}">
        <div class="toolbar">
          <h2>Dashboard</h2>
        </div>
        <div class="stats-grid">
          <div class="stat card"><div>Users</div><div class="value" data-testid="user-count">0</div></div>
          <div class="stat card"><div>Products</div><div class="value" data-testid="product-count">0</div></div>
          <div class="stat card"><div>Search Results</div><div class="value" data-testid="search-count">0</div></div>
        </div>
      </section>

      <section id="users" class="${state.section === 'users' ? '' : 'hidden'}">
        <div class="toolbar">
          <h2>Users</h2>
          <button class="primary" id="create-user-button" data-testid="create-user-button">Create user</button>
        </div>
        <form id="user-form" class="card inline-form hidden" data-testid="user-form">
          <input name="name" placeholder="Name" data-testid="user-name" required />
          <input name="email" placeholder="Email" data-testid="user-email" required />
          <select name="role" data-testid="user-role">
            <option>Admin</option>
            <option>Editor</option>
            <option>Viewer</option>
          </select>
          <button type="submit" class="primary" data-testid="save-user-button">Save</button>
          <button type="button" class="secondary" id="cancel-user-form" data-testid="cancel-user-form">Cancel</button>
        </form>
        <div class="table-wrap card">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody id="user-table-body" data-testid="user-table-body"></tbody>
          </table>
        </div>
      </section>

      <section id="products" class="${state.section === 'products' ? '' : 'hidden'}">
        <div class="toolbar">
          <h2>Products</h2>
          <div class="search-row">
            <input id="search-input" data-testid="product-search" placeholder="Search products or users" value="${state.search}" />
            <button class="primary" id="create-product-button" data-testid="create-product-button">Create product</button>
          </div>
        </div>
        <form id="product-form" class="card inline-form hidden" data-testid="product-form">
          <input name="name" placeholder="Product name" data-testid="product-name" required />
          <input name="category" placeholder="Category" data-testid="product-category" required />
          <input name="price" type="number" placeholder="Price" data-testid="product-price" required />
          <input name="stock" type="number" placeholder="Stock" data-testid="product-stock" required />
          <select name="status" data-testid="product-status">
            <option>Active</option>
            <option>Draft</option>
          </select>
          <button type="submit" class="primary" data-testid="save-product-button">Save</button>
          <button type="button" class="secondary" id="cancel-product-form" data-testid="cancel-product-form">Cancel</button>
        </form>
        <div class="table-wrap card">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody id="product-table-body" data-testid="product-table-body"></tbody>
          </table>
        </div>
      </section>
    </main>
    <div id="toast" class="toast" data-testid="toast"></div>
  `;

  loadDashboard();
  attachMainHandlers();
};

async function loadDashboard() {
  const headers = { Authorization: `Bearer ${state.token}` };
  const [usersRes, productsRes] = await Promise.all([
    fetch('/api/users', { headers }),
    fetch('/api/products', { headers }),
  ]);

  state.users = await usersRes.json();
  state.products = await productsRes.json();

  document.querySelector('[data-testid="user-count"]').textContent = String(state.users.length);
  document.querySelector('[data-testid="product-count"]').textContent = String(state.products.length);
  document.querySelector('[data-testid="search-count"]').textContent = String(state.products.length + state.users.length);

  renderUsersTable();
  renderProductsTable();
}

function renderUsersTable() {
  const tbody = document.getElementById('user-table-body');
  tbody.innerHTML = state.users.map((user) => `
    <tr data-testid="user-row-${user.id}">
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="secondary" data-user-id="${user.id}" data-action="edit-user" data-testid="edit-user-${user.id}">Edit</button>
        <button class="danger" data-user-id="${user.id}" data-action="delete-user" data-testid="delete-user-${user.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderProductsTable() {
  const filtered = state.products.filter((product) => {
    const search = state.search.trim().toLowerCase();
    if (!search) return true;
    return Object.values(product).join(' ').toLowerCase().includes(search);
  });

  const tbody = document.getElementById('product-table-body');
  tbody.innerHTML = filtered.map((product) => `
    <tr data-testid="product-row-${product.id}">
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${Number(product.price).toFixed(2)}</td>
      <td>${product.stock}</td>
      <td><span class="badge ${product.status.toLowerCase()}">${product.status}</span></td>
      <td>
        <button class="secondary" data-product-id="${product.id}" data-action="edit-product" data-testid="edit-product-${product.id}">Edit</button>
        <button class="danger" data-product-id="${product.id}" data-action="delete-product" data-testid="delete-product-${product.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  document.querySelector('[data-testid="search-count"]').textContent = String(filtered.length);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function attachLoginHandler() {
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      document.getElementById('login-error').textContent = 'Invalid username or password';
      document.getElementById('login-error').classList.remove('hidden');
      return;
    }

    const result = await response.json();
    state.token = result.token;
    localStorage.setItem('demo-token', result.token);
    render();
  });
}

function attachMainHandlers() {
  document.querySelectorAll('[data-section]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      state.section = link.dataset.section;
      render();
    });
  });

  document.getElementById('logout-button').addEventListener('click', () => {
    state.token = '';
    localStorage.removeItem('demo-token');
    render();
  });

  document.getElementById('create-user-button').addEventListener('click', () => {
    document.getElementById('user-form').classList.remove('hidden');
  });

  document.getElementById('cancel-user-form').addEventListener('click', () => {
    document.getElementById('user-form').reset();
    document.getElementById('user-form').classList.add('hidden');
  });

  document.getElementById('user-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    };
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
      body: JSON.stringify(payload),
    });
    event.target.reset();
    event.target.classList.add('hidden');
    showToast('User created');
    loadDashboard();
  });

  document.getElementById('create-product-button').addEventListener('click', () => {
    document.getElementById('product-form').classList.remove('hidden');
  });

  document.getElementById('cancel-product-form').addEventListener('click', () => {
    document.getElementById('product-form').reset();
    document.getElementById('product-form').classList.add('hidden');
  });

  document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      status: formData.get('status'),
    };
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.token}` },
      body: JSON.stringify(payload),
    });
    event.target.reset();
    event.target.classList.add('hidden');
    showToast('Product created');
    loadDashboard();
  });

  document.getElementById('search-input').addEventListener('input', async (event) => {
    state.search = event.target.value;
    const response = await fetch(`/api/search?q=${encodeURIComponent(state.search)}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    const data = await response.json();
    state.products = data.products || [];
    state.users = data.users || [];
    renderProductsTable();
  });

  document.body.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    if (action === 'delete-user') {
      const userId = target.dataset.userId;
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${state.token}` },
      });
      showToast('User deleted');
      loadDashboard();
    }

    if (action === 'delete-product') {
      const productId = target.dataset.productId;
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${state.token}` },
      });
      showToast('Product deleted');
      loadDashboard();
    }
  });
}

render();
