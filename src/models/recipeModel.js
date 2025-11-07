const pool = require('../config/database');

const recipeModel = {
  // Get all recipes
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY name ASC'
    );
    return result.rows;
  },

  // Get one recipe by ID
  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Create new recipe
  async create(recipeData) {
    const {
      name,
      category,
      description,
      base_portion_size,
      instructions,
      image_url,
      has_aggregate_ingredient,
      aggregate_ingredient_name,
      aggregate_ingredient_amount
    } = recipeData;

    const result = await pool.query(
      `INSERT INTO recipes (
        name, category, description, base_portion_size, instructions, image_url,
        has_aggregate_ingredient, aggregate_ingredient_name, aggregate_ingredient_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        name, category, description, base_portion_size, instructions, image_url,
        has_aggregate_ingredient, aggregate_ingredient_name, aggregate_ingredient_amount
      ]
    );
    return result.rows[0];
  },

  // Update recipe
  async update(id, recipeData) {
    const {
      name,
      category,
      description,
      base_portion_size,
      instructions,
      image_url,
      has_aggregate_ingredient,
      aggregate_ingredient_name,
      aggregate_ingredient_amount
    } = recipeData;

    const result = await pool.query(
      `UPDATE recipes SET
        name = $1,
        category = $2,
        description = $3,
        base_portion_size = $4,
        instructions = $5,
        image_url = $6,
        has_aggregate_ingredient = $7,
        aggregate_ingredient_name = $8,
        aggregate_ingredient_amount = $9
      WHERE id = $10
      RETURNING *`,
      [
        name, category, description, base_portion_size, instructions, image_url,
        has_aggregate_ingredient, aggregate_ingredient_name, aggregate_ingredient_amount, id
      ]
    );
    return result.rows[0];
  },

  // Delete recipe
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = recipeModel;