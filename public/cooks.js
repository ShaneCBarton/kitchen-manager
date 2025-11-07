const API_BASE = 'http://localhost:3000/api';

// DOM elements
const cookForm = document.getElementById('cook-form');
const cookList = document.getElementById('cook-list');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

const cookIdInput = document.getElementById('cook-id');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

let isEditing = false;

// Load cooks on page load
loadCooks();

// Form submit handler
cookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const cookData = {
    name: nameInput.value,
    email: emailInput.value || null
  };

  try {
    if (isEditing) {
      const id = cookIdInput.value;
      await fetch(`${API_BASE}/cooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cookData)
      });
      showMessage('Cook updated successfully!', 'success');
    } else {
      await fetch(`${API_BASE}/cooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cookData)
      });
      showMessage('Cook created successfully!', 'success');
    }

    resetForm();
    loadCooks();
  } catch (error) {
    showMessage('Error saving cook: ' + error.message, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);

async function loadCooks() {
  try {
    const response = await fetch(`${API_BASE}/cooks`);
    const cooks = await response.json();
    displayCooks(cooks);
  } catch (error) {
    cookList.innerHTML = '<li style="color: red;">Error loading cooks</li>';
  }
}

function displayCooks(cooks) {
  if (cooks.length === 0) {
    cookList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No cooks yet. Add one!</li>';
    return;
  }

  cookList.innerHTML = cooks.map(cook => `
    <li class="recipe-item">
      <div class="recipe-info">
        <h3>${cook.name}</h3>
        <p>${cook.email || 'No email'}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="editCook(${cook.id})">Edit</button>
        <button class="danger" onclick="deleteCook(${cook.id}, '${cook.name}')">Delete</button>
      </div>
    </li>
  `).join('');
}

async function editCook(id) {
  try {
    const response = await fetch(`${API_BASE}/cooks/${id}`);
    const cook = await response.json();

    cookIdInput.value = cook.id;
    nameInput.value = cook.name;
    emailInput.value = cook.email || '';

    isEditing = true;
    formTitle.textContent = 'Edit Cook';
    cancelBtn.style.display = 'inline-block';
    
    cookForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading cook: ' + error.message, 'error');
  }
}

async function deleteCook(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    await fetch(`${API_BASE}/cooks/${id}`, {
      method: 'DELETE'
    });
    showMessage('Cook deleted successfully!', 'success');
    loadCooks();
  } catch (error) {
    showMessage('Error deleting cook: ' + error.message, 'error');
  }
}

function resetForm() {
  cookForm.reset();
  cookIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Add New Cook';
  cancelBtn.style.display = 'none';
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

window.editCook = editCook;
window.deleteCook = deleteCook;