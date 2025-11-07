const API_BASE = 'http://localhost:3000/api';

// DOM elements
const clientForm = document.getElementById('client-form');
const clientList = document.getElementById('client-list');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

const clientIdInput = document.getElementById('client-id');
const nameInput = document.getElementById('name');
const dietaryNotesInput = document.getElementById('dietary-notes');

let isEditing = false;

// Load clients on page load
loadClients();

// Form submit handler
clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const clientData = {
    name: nameInput.value,
    dietary_notes: dietaryNotesInput.value || null
  };

  try {
    if (isEditing) {
      const id = clientIdInput.value;
      await fetch(`${API_BASE}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      showMessage('Client updated successfully!', 'success');
    } else {
      await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      showMessage('Client created successfully!', 'success');
    }

    resetForm();
    loadClients();
  } catch (error) {
    showMessage('Error saving client: ' + error.message, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);

async function loadClients() {
  try {
    const response = await fetch(`${API_BASE}/clients`);
    const clients = await response.json();
    displayClients(clients);
  } catch (error) {
    clientList.innerHTML = '<li style="color: red;">Error loading clients</li>';
  }
}

function displayClients(clients) {
  if (clients.length === 0) {
    clientList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No clients yet. Add one!</li>';
    return;
  }

  clientList.innerHTML = clients.map(client => `
    <li class="recipe-item">
      <div class="recipe-info">
        <h3>${client.name}</h3>
        <p>${client.dietary_notes || 'No dietary notes'}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="editClient(${client.id})">Edit</button>
        <button class="danger" onclick="deleteClient(${client.id}, '${client.name}')">Delete</button>
      </div>
    </li>
  `).join('');
}

async function editClient(id) {
  try {
    const response = await fetch(`${API_BASE}/clients/${id}`);
    const client = await response.json();

    clientIdInput.value = client.id;
    nameInput.value = client.name;
    dietaryNotesInput.value = client.dietary_notes || '';

    isEditing = true;
    formTitle.textContent = 'Edit Client';
    cancelBtn.style.display = 'inline-block';
    
    clientForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading client: ' + error.message, 'error');
  }
}

async function deleteClient(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE'
    });
    showMessage('Client deleted successfully!', 'success');
    loadClients();
  } catch (error) {
    showMessage('Error deleting client: ' + error.message, 'error');
  }
}

function resetForm() {
  clientForm.reset();
  clientIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Add New Client';
  cancelBtn.style.display = 'none';
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

window.editClient = editClient;
window.deleteClient = deleteClient;