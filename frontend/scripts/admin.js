async function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    showAlert('Admin access only');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    return false;
  }
  return true;
}
async function loadQuestions() {
  try {
    const res = await fetch(`${API_BASE}/admin/questions`, {
      headers: authHeader()
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.message || 'Failed to load questions');
      return;
    }
    const tbody = document.querySelector('#questions-table tbody');
    tbody.innerHTML = '';
    data.questions.forEach(q => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${q.questionText}</td>
        <td>${q.category}</td>
        <td>${q.correctAnswerIndex}</td>
        <td>
          <button class="secondary" data-id="${q._id}" data-action="edit">Edit</button>
          <button class="danger" data-id="${q._id}" data-action="delete">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    showAlert('Error loading questions');
  }
}
async function loadResults() {
  try {
    const res = await fetch(`${API_BASE}/admin/results`, {
      headers: authHeader()
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.message || 'Failed to load results');
      return;
    }
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';
    data.results.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.user?.name || 'N/A'}</td>
        <td>${r.user?.email || 'N/A'}</td>
        <td>${r.score}</td>
        <td>${r.totalQuestions}</td>
        <td>${new Date(r.createdAt).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    showAlert('Error loading results');
  }
}
async function saveQuestion(e) {
  e.preventDefault();
  const id = document.getElementById('question-id').value;
  const questionText = document.getElementById('question-text-input').value.trim();
  const optionsText = document.getElementById('options-input').value.trim();
  const correctIndexVal = document.getElementById('correct-index').value;
  const category = document.getElementById('category').value.trim();
  if (!questionText || !optionsText || correctIndexVal === '') {
    showAlert('All fields are required', 'error');
    return;
  }
  const options = optionsText.split('\n').map(o => o.trim()).filter(Boolean);
  const correctAnswerIndex = parseInt(correctIndexVal, 10);
  const payload = { questionText, options, correctAnswerIndex, category };
  try {
    const url = id
      ? `${API_BASE}/admin/questions/${id}`
      : `${API_BASE}/admin/questions`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: authHeader(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert(data.message || 'Failed to save question');
      return;
    }
    showAlert('Question saved successfully', 'success');
    resetForm();
    loadQuestions();
  } catch (err) {
    console.error(err);
    showAlert('Error saving question');
  }
}
function resetForm() {
  document.getElementById('question-id').value = '';
  document.getElementById('question-text-input').value = '';
  document.getElementById('options-input').value = '';
  document.getElementById('correct-index').value = '';
  document.getElementById('category').value = '';
}
if (document.getElementById('question-form')) {
  (async () => {
    if (!getToken() || !(await requireAdmin())) {
      return;
    }
    renderUserInfo();
    loadQuestions();
    loadResults();
  })();
  document
    .getElementById('question-form')
    .addEventListener('submit', saveQuestion);
  document
    .getElementById('reset-form-btn')
    .addEventListener('click', resetForm);
  document
    .getElementById('questions-table')
    .addEventListener('click', async e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const { id, action } = btn.dataset;
      if (action === 'edit') {
        const row = btn.closest('tr');
        const qText = row.children[0].textContent;
        const category = row.children[1].textContent;
        const correctIndex = row.children[2].textContent;
        document.getElementById('question-id').value = id;
        document.getElementById('question-text-input').value = qText;
        document.getElementById('category').value = category;
        document.getElementById('correct-index').value = correctIndex;
        showAlert(
          'Loaded question for editing. Please re-enter options if needed.',
          'success'
        );
      } else if (action === 'delete') {
        if (!confirm('Delete this question?')) return;
        try {
          const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
            method: 'DELETE',
            headers: authHeader()
          });
          const data = await res.json();
          if (!res.ok) {
            showAlert(data.message || 'Failed to delete question');
            return;
          }
          showAlert('Question deleted', 'success');
          loadQuestions();
        } catch (err) {
          console.error(err);
          showAlert('Error deleting question');
        }
      }
    });
}
