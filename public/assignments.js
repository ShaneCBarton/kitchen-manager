const API_BASE = 'http://localhost:3000/api';

// DOM elements
const assignmentForm = document.getElementById('assignment-form');
const assignmentList = document.getElementById('assignment-list');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

const assignmentIdInput = document.getElementById('assignment-id');
const cookSelect = document.getElementById('cook');
const recipeSelect = document.getElementById('recipe');
const clientSelect = document.getElementById('client');
const dateInput = document.getElementById('date');
const portionsInput = document.getElementById('portions');
const notesInput = document.getElementById('notes');

const filterDateInput = document.getElementById('filter-date');
const filterCookSelect = document.getElementById('filter-cook');

const aggCookSelect = document.getElementById('agg-cook');
const aggDateInput = document.getElementById('agg-date');
const aggregationResults = document.getElementById('aggregation-results');

let isEditing = false;
let cooks = [];
let recipes = [];
let clients = [];

// Load data on page load
init();

async function init() {
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  aggDateInput.value = today;
  
  await loadCooks();
  await loadRecipes();
  await loadClients();
  await loadAssignments();
}

async function loadCooks() {
  try {
    const response = await fetch(`${API_BASE}/cooks`);
    cooks = await response.json();
    
    // Populate cook dropdowns
    const cookOptions = cooks.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    cookSelect.innerHTML = '<option value="">Select a cook...</option>' + cookOptions;
    filterCookSelect.innerHTML = '<option value="">All cooks</option>' + cookOptions;
    aggCookSelect.innerHTML = '<option value="">Select cook...</option>' + cookOptions;
  } catch (error) {
    console.error('Error loading cooks:', error);
  }
}

async function loadRecipes() {
  try {
    const response = await fetch(`${API_BASE}/recipes`);
    recipes = await response.json();
    
    const recipeOptions = recipes.map(r => {
      const ingredientInfo = r.has_aggregate_ingredient 
        ? ` (${r.aggregate_ingredient_name})` 
        : '';
      return `<option value="${r.id}">${r.name}${ingredientInfo}</option>`;
    }).join('');
    recipeSelect.innerHTML = '<option value="">Select a recipe...</option>' + recipeOptions;
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
}

async function loadClients() {
  try {
    const response = await fetch(`${API_BASE}/clients`);
    clients = await response.json();
    
    const clientOptions = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    clientSelect.innerHTML = '<option value="">None</option>' + clientOptions;
  } catch (error) {
    console.error('Error loading clients:', error);
  }
}

// Form submit handler
assignmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const assignmentData = {
    cook_id: parseInt(cookSelect.value),
    recipe_id: parseInt(recipeSelect.value),
    client_id: clientSelect.value ? parseInt(clientSelect.value) : null,
    assignment_date: dateInput.value,
    portions_needed: parseInt(portionsInput.value),
    notes: notesInput.value || null
  };

  try {
    if (isEditing) {
      const id = assignmentIdInput.value;
      await fetch(`${API_BASE}/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData)
      });
      showMessage('Assignment updated successfully!', 'success');
    } else {
      await fetch(`${API_BASE}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData)
      });
      showMessage('Assignment created successfully!', 'success');
    }

    resetForm();
    loadAssignments();
  } catch (error) {
    showMessage('Error saving assignment: ' + error.message, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);

// Filter handlers
filterDateInput.addEventListener('change', loadAssignments);
filterCookSelect.addEventListener('change', loadAssignments);

async function loadAssignments() {
  try {
    const response = await fetch(`${API_BASE}/assignments`);
    let assignments = await response.json();
    
    // Apply filters
    if (filterDateInput.value) {
      assignments = assignments.filter(a => a.assignment_date === filterDateInput.value);
    }
    if (filterCookSelect.value) {
      assignments = assignments.filter(a => a.cook_id === parseInt(filterCookSelect.value));
    }
    
    displayAssignments(assignments);
  } catch (error) {
    assignmentList.innerHTML = '<li style="color: red;">Error loading assignments</li>';
  }
}

function displayAssignments(assignments) {
  if (assignments.length === 0) {
    assignmentList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No assignments found.</li>';
    return;
  }

  assignmentList.innerHTML = assignments.map(assignment => {
    const date = new Date(assignment.assignment_date).toLocaleDateString();
    return `
      <li class="recipe-item">
        <div class="recipe-info">
          <h3>${assignment.recipe_name}</h3>
          <p><strong>${assignment.cook_name}</strong> • ${date} • ${assignment.portions_needed} portions</p>
          ${assignment.client_name ? `<p class="assignment-detail">Client: ${assignment.client_name}</p>` : ''}
          ${assignment.notes ? `<p class="assignment-detail">${assignment.notes}</p>` : ''}
        </div>
        <div class="recipe-actions">
          <button onclick="editAssignment(${assignment.id})">Edit</button>
          <button class="danger" onclick="deleteAssignment(${assignment.id})">Delete</button>
        </div>
      </li>
    `;
  }).join('');
}

async function editAssignment(id) {
  try {
    const response = await fetch(`${API_BASE}/assignments`);
    const assignments = await response.json();
    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
      showMessage('Assignment not found', 'error');
      return;
    }

    assignmentIdInput.value = assignment.id;
    cookSelect.value = assignment.cook_id;
    recipeSelect.value = assignment.recipe_id;
    clientSelect.value = assignment.client_id || '';
    dateInput.value = assignment.assignment_date;
    portionsInput.value = assignment.portions_needed;
    notesInput.value = assignment.notes || '';

    isEditing = true;
    formTitle.textContent = 'Edit Assignment';
    cancelBtn.style.display = 'inline-block';
    
    assignmentForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading assignment: ' + error.message, 'error');
  }
}

async function deleteAssignment(id) {
  if (!confirm('Are you sure you want to delete this assignment?')) {
    return;
  }

  try {
    await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'DELETE'
    });
    showMessage('Assignment deleted successfully!', 'success');
    loadAssignments();
  } catch (error) {
    showMessage('Error deleting assignment: ' + error.message, 'error');
  }
}

async function loadAggregation() {
  const cookId = aggCookSelect.value;
  const date = aggDateInput.value;

  if (!cookId || !date) {
    showMessage('Please select both cook and date', 'error');
    return;
  }

  try {
    // Get assignments for this cook and date
    const assignmentsResponse = await fetch(`${API_BASE}/assignments/cook/${cookId}/date/${date}`);
    const assignments = await assignmentsResponse.json();

    // Get aggregated ingredients
    const aggResponse = await fetch(`${API_BASE}/assignments/cook/${cookId}/date/${date}/aggregated`);
    const ingredients = await aggResponse.json();

    displayAggregation(assignments, ingredients);
  } catch (error) {
    aggregationResults.innerHTML = '<p style="color: red;">Error loading aggregation data</p>';
  }
}

function displayAggregation(assignments) {
  if (assignments.length === 0) {
    aggregationResults.innerHTML = '<p style="color: #999;">No assignments for this cook on this date.</p>';
    return;
  }

  // Format grams to kg if over 1000g
  const formatWeight = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)}kg`;
    }
    return `${grams.toFixed(0)}g`;
  };

  // Group assignments by recipe_id
  const groupedByRecipe = {};
  
  assignments.forEach(assignment => {
    if (!groupedByRecipe[assignment.recipe_id]) {
      groupedByRecipe[assignment.recipe_id] = {
        recipe_name: assignment.recipe_name,
        recipe_id: assignment.recipe_id,
        has_aggregate_ingredient: assignment.has_aggregate_ingredient,
        aggregate_ingredient_name: assignment.aggregate_ingredient_name,
        aggregate_ingredient_amount: assignment.aggregate_ingredient_amount,
        total_portions: 0,
        clients: []
      };
    }
    
    groupedByRecipe[assignment.recipe_id].total_portions += assignment.portions_needed;
    groupedByRecipe[assignment.recipe_id].clients.push({
      name: assignment.client_name || 'No client specified',
      portions: assignment.portions_needed
    });
  });

  // Build the display
  let html = '';
  
  Object.values(groupedByRecipe).forEach(group => {
    // Calculate total ingredient amount
    let ingredientDisplay = '';
    if (group.has_aggregate_ingredient && group.aggregate_ingredient_name) {
      const totalAmount = group.total_portions * group.aggregate_ingredient_amount;
      ingredientDisplay = `
        <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-top: 10px;">
          <strong>📦 ${group.aggregate_ingredient_name}:</strong> ${formatWeight(totalAmount)}
        </div>
      `;
    }
    
    // Build client list
    const clientList = group.clients.map(client => 
      `<li>${client.name}: ${client.portions} portion${client.portions > 1 ? 's' : ''}</li>`
    ).join('');
    
    html += `
      <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${group.recipe_name}</h3>
        <p style="color: #666; margin-bottom: 10px;">
          <strong>Total: ${group.total_portions} portions</strong>
        </p>
        <ul style="margin: 0 0 10px 20px; color: #666;">
          ${clientList}
        </ul>
        ${ingredientDisplay}
      </div>
    `;
  });

  aggregationResults.innerHTML = html;
}

function resetForm() {
  assignmentForm.reset();
  assignmentIdInput.value = '';
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
  isEditing = false;
  formTitle.textContent = 'Create Assignment';
  cancelBtn.style.display = 'none';
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

window.editAssignment = editAssignment;
window.deleteAssignment = deleteAssignment;
window.loadAggregation = loadAggregation;