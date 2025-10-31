const API_BASE = 'http://localhost:3000/api';

// DOM elements
const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const messageDiv = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');

// Form fields
const recipeIdInput = document.getElementById('recipe-id');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const portionSizeInput = document.getElementById('base-portion-size');
const descriptionInput = document.getElementById('description');
const instructionsInput = document.getElementById('instructions');
const imageInput = document.getElementById('image');
const currentImageUrlInput = document.getElementById('current-image-url');
const imagePreview = document.getElementById('image-preview');

// State
let isEditing = false;

// Load recipes on page load
loadRecipes();

// Image preview on file select
imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; border-radius: 4px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = '';
  }
});

// Form submit handler
recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    let imageUrl = currentImageUrlInput.value || null;

    // Upload image if one was selected
    if (imageInput.files.length > 0) {
      const formData = new FormData();
      formData.append('image', imageInput.files[0]);

      const uploadResponse = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.success) {
        imageUrl = uploadResult.imageUrl;
      }
    }

    // Prepare recipe data
    const recipeData = {
      name: nameInput.value,
      category: categoryInput.value,
      base_portion_size: parseInt(portionSizeInput.value),
      description: descriptionInput.value,
      instructions: instructionsInput.value,
      image_url: imageUrl
    };

    if (isEditing) {
      // Update existing recipe
      const id = recipeIdInput.value;
      await fetch(`${API_BASE}/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData)
      });
      showMessage('Recipe updated successfully!', 'success');
    } else {
      // Create new recipe
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

// Cancel button handler
cancelBtn.addEventListener('click', resetForm);

// Load all recipes from API
async function loadRecipes() {
  try {
    const response = await fetch(`${API_BASE}/recipes`);
    const recipes = await response.json();
    displayRecipes(recipes);
  } catch (error) {
    recipeList.innerHTML = '<li style="color: red;">Error loading recipes</li>';
  }
}

// Display recipes in the list
function displayRecipes(recipes) {
  if (recipes.length === 0) {
    recipeList.innerHTML = '<li style="text-align: center; padding: 20px; color: #999;">No recipes yet. Add one!</li>';
    return;
  }

  recipeList.innerHTML = recipes.map(recipe => `
    <li class="recipe-item">
      <div class="recipe-info">
        <h3 onclick="viewRecipe(${recipe.id})">${recipe.name}</h3>
        <p>${recipe.category || 'No category'} • ${recipe.base_portion_size} portion${recipe.base_portion_size > 1 ? 's' : ''}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="editRecipe(${recipe.id})">Edit</button>
        <button class="danger" onclick="deleteRecipe(${recipe.id}, '${recipe.name}')">Delete</button>
      </div>
    </li>
  `).join('');
}

// Edit recipe - load data into form
async function editRecipe(id) {
  try {
    const response = await fetch(`${API_BASE}/recipes/${id}`);
    const recipe = await response.json();

    // Populate form
    recipeIdInput.value = recipe.id;
    nameInput.value = recipe.name;
    categoryInput.value = recipe.category || '';
    portionSizeInput.value = recipe.base_portion_size;
    descriptionInput.value = recipe.description || '';
    instructionsInput.value = recipe.instructions || '';
    currentImageUrlInput.value = recipe.image_url || '';

    // Show current image if exists
    if (recipe.image_url) {
      imagePreview.innerHTML = `
        <img src="${recipe.image_url}" style="max-width: 200px; border-radius: 4px;">
        <p style="font-size: 12px; color: #666; margin-top: 5px;">Current image (upload new to replace)</p>
      `;
    }

    // Update UI
    isEditing = true;
    formTitle.textContent = 'Edit Recipe';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    recipeForm.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading recipe: ' + error.message, 'error');
  }
}

// Delete recipe
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

// Reset form to initial state
function resetForm() {
  recipeForm.reset();
  recipeIdInput.value = '';
  currentImageUrlInput.value = '';
  imagePreview.innerHTML = '';
  isEditing = false;
  formTitle.textContent = 'Add New Recipe';
  cancelBtn.style.display = 'none';
}

// Show message notification
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

// View recipe details in modal
async function viewRecipe(id) {
  try {
    const response = await fetch(`${API_BASE}/recipes/${id}`);
    const recipe = await response.json();

    const detailHTML = `
      <h2>${recipe.name}</h2>
      <div class="recipe-meta">
        <strong>Category:</strong> ${recipe.category || 'N/A'} | 
        <strong>Base Portions:</strong> ${recipe.base_portion_size}
      </div>
      
      ${recipe.image_url ? `
        <img src="${recipe.image_url}" alt="${recipe.name}">
      ` : ''}
      
      ${recipe.description ? `
        <div class="recipe-section">
          <h3>Description</h3>
          <p>${recipe.description}</p>
        </div>
      ` : ''}
      
      ${recipe.instructions ? `
        <div class="recipe-section">
          <h3>Instructions</h3>
          <p>${recipe.instructions}</p>
        </div>
      ` : ''}
    `;

    document.getElementById('recipe-detail').innerHTML = detailHTML;
    document.getElementById('recipe-modal').classList.add('show');
  } catch (error) {
    showMessage('Error loading recipe details: ' + error.message, 'error');
  }
}

// Close recipe modal
function closeRecipeModal() {
  document.getElementById('recipe-modal').classList.remove('show');
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('recipe-modal');
  if (event.target === modal) {
    closeRecipeModal();
  }
}

window.editRecipe = editRecipe;
window.deleteRecipe = deleteRecipe;
window.viewRecipe = viewRecipe;
window.closeRecipeModal = closeRecipeModal;