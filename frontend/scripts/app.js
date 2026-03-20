const API_BASE = '/api';
function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('lastResult');
}
function getToken() {
  return localStorage.getItem('token');
}
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
function authHeader() {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  };
}
function showAlert(message, type = 'error') {
  const container = document.getElementById('alert-container');
  if (!container) return;
  container.innerHTML = `<div class="alert ${type}">${message}</div>`;
  setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}
function renderUserInfo() {
  const userInfoEl = document.getElementById('user-info');
  if (!userInfoEl) return;
  const user = getUser();
  if (user) {
    userInfoEl.innerHTML = `Logged in as <strong>${user.name}</strong> <span class="badge ${
      user.role
    }">${user.role}</span>`;
  } else {
    userInfoEl.textContent = 'Not logged in';
  }
}
if (document.getElementById('auth-form')) {
  renderUserInfo();
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const toggleAuthBtn = document.getElementById('toggle-auth');
  const toggleText = document.getElementById('toggle-text');
  const nameInput = document.getElementById('name');
  const nameLabel = document.getElementById('name-label');
  const authSubmit = document.getElementById('auth-submit');
  const actionsCard = document.getElementById('actions-card');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const myResultsBtn = document.getElementById('my-results-btn');
  const adminPanelBtn = document.getElementById('admin-panel-btn');
  const logoutBtn = document.getElementById('logout-btn');
  let isLogin = true;
  function updateUIForAuthState() {
    const user = getUser();
    if (user) {
      document.getElementById('auth-card').style.display = 'none';
      actionsCard.style.display = 'block';
      if (user.role === 'admin') {
        adminPanelBtn.style.display = 'inline-block';
      } else {
        adminPanelBtn.style.display = 'none';
      }
    } else {
      document.getElementById('auth-card').style.display = 'block';
      actionsCard.style.display = 'none';
    }
    renderUserInfo();
  }
  updateUIForAuthState();
  toggleAuthBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
      authTitle.textContent = 'Login';
      authSubmit.textContent = 'Login';
      toggleText.textContent = "Don't have an account?";
      toggleAuthBtn.textContent = 'Register';
      nameInput.style.display = 'none';
      nameLabel.style.display = 'none';
    } else {
      authTitle.textContent = 'Register';
      authSubmit.textContent = 'Register';
      toggleText.textContent = 'Already have an account?';
      toggleAuthBtn.textContent = 'Login';
      nameInput.style.display = 'block';
      nameLabel.style.display = 'block';
    }
  });
  authForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();
    try {
      let url = `${API_BASE}/auth/login`;
      let body = { email, password };
      if (!isLogin) {
        if (!name) {
          showAlert('Name is required for registration');
          return;
        }
        url = `${API_BASE}/auth/register`;
        body = { name, email, password };
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        showAlert(data.message || 'Authentication failed');
        return;
      }
      setAuth(data.token, data.user);
      showAlert(isLogin ? 'Login successful' : 'Registration successful', 'success');
      updateUIForAuthState();
    } catch (err) {
      console.error(err);
      showAlert('Something went wrong');
    }
  });
  startQuizBtn.addEventListener('click', () => {
    if (!getToken()) {
      showAlert('Please login first');
      return;
    }
    window.location.href = 'quiz.html';
  });
  myResultsBtn.addEventListener('click', async () => {
    if (!getToken()) {
      showAlert('Please login first');
      return;
    }
    window.location.href = 'result.html';
  });
  adminPanelBtn.addEventListener('click', () => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      showAlert('Admin access only');
      return;
    }
    window.location.href = 'admin.html';
  });
  logoutBtn.addEventListener('click', () => {
    clearAuth();
    updateUIForAuthState();
    showAlert('Logged out', 'success');
  });
}
if (!document.getElementById('auth-form')) {
  renderUserInfo();
}
