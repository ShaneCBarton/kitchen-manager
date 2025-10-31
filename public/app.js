const API_BASE = 'http://localhost:3000/api';

const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

const recipeIdInput = document.getElementById('recipe-id');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const portionSizeInput = document.getElementById('base-portion-size');
const descriptionInput = document.getElementById('description');
const instructionsInput = document.getElementById('instructions');

let isEditing = false;

loadRecipes();

recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const recipeData = {
    name: nameInput.value,
    category: categoryInput.value,
    base_portion_size: parseInt(portionSizeInput.value),
    description: descriptionInput.value,
    instructions: instructionsInput.value
  };

  try {
    if (isEditing) {
      const id = recipeIdInput.value;
      await fetch(`${API_BASE}/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });
      showMessage('Recipe updated successfully!', 'success');
    } else {
      await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });
      showMessage('Recipe created successfully!', 'success');
    }

    resetForm();
    loadRecipes();
  } catch (error) {
    showMessage('Error saving recipe: ' + error.message, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);

async function loadRecipes() {
  try {
    const response = await fetch(`${API_BASE}/recipes`);
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    recipeList.innerHTML = '<li style="color: red;">Error loading recipes</li>';
  }
}

function displayRecipes(recipes) {
  if (recipes.length === 0) {
    recipeList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No recipes yet. Add one!</li>';
    return;
  }

  recipeList.innerHTML = recipes.map(recipe => `
    <li class="recipe-item">
      <div class="recipe-info">
        <h3>${recipe.name}</h3>
        <p>${recipe.category || 'No category'} • ${recipe.base_portion_size} portion${recipe.base_portion_size > 1 ? 's' : ''}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="editRecipe(${recipe.id})">Edit</button>
        <button class="danger" onclick="deleteRecipe(${recipe.id}, '${recipe.name}')">Delete</button>
      </div>
    </li>
  `).join('');
}

async function editRecipe(id) {
  try {
    const response = await fetch(`${API_BASE}/recipes/${id}`);
    const recipe = await response.json();

    recipeIdInput.value = recipe.id;
    nameInput.value = recipe.name;
    categoryInput.value = recipe.category || '';
    portionSizeInput.value = recipe.base_portion_size;
    descriptionInput.value = recipe.description || '';
    instructionsInput.value = recipe.instructions || '';

    isEditing = true;
    formTitle.textContent = 'Edit Recipe';
    cancelBtn.style.display = 'inline-block';
    
    recipeForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading recipe: ' + error.message, 'error');
  }
}

async function deleteRecipe(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'DELETE'
    });
    showMessage('Recipe deleted successfully!', 'success');
    loadRecipes();
  } catch (error) {
    showMessage('Error deleting recipe: ' + error.message, 'error');
  }
}

function resetForm() {
  recipeForm.reset();
  recipeIdInput.value = '';
  isEditing = false;
  formTitle.textContent = 'Add New Recipe';
  cancelBtn.style.display = 'none';
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

window.editRecipe = editRecipe;
window.deleteRecipe = deleteRecipe;

