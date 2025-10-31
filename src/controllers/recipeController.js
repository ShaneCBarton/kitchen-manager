const recipeModel = require('../models/recipeModel');

const recipeController = {
    async getAllRecipes(req, res) {
        try {
            const recipes = await recipeModel.getAll();
            res.json(recipes);
        } catch (err) {
            console.error('Error getting recipes:', err);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        }
    },

    async getRecipeById(req, res) {
        try {
            const { id } = req.params;
            const recipe = await recipeModel.getById(id);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json(recipe);
        } catch (err) {
            console.error('Error getting recipe', err);
            res.status(500).json({ error: 'Failed to fetch recipe' });
        }
    },

    async createRecipe(req, res) {
        try {
            const recipe = await recipeModel.create(req.body);
            res.status(201).json(recipe);
        } catch (err) {
            console.error('Error creating recipe:', err);
            res.status(500).json({ error: 'Failed to create recipe' });
        }
    },

    async updateRecipe(req, res) {
        try {
            const { id } = req.params;
            const recipe = await recipeModel.update(id, req.body);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json(recipe);
        } catch (err) {
            console.error('Error updating recipe:', err);
            res.status(500).json({ error: 'Faled to update recipe' });
        }
    },

    async deleteRecipe(req, res) {
        try {
            const { id } = req.params;
            const recipe = await recipeModel.delete(id);

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }

            res.json({ message: 'Recipe deleted succesfully', recipe });
        } catch (err) {
            console.error('Error deleting recipe:', err);
            res.status(500).json({ error: 'Failed to delete recipe' });
        }
    }
};

module.exports = recipeController;