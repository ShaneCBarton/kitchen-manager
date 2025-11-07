const pool = require('../config/database');

const assignmentModel = {
  // Get all assignments with recipe and cook names
  async getAll() {
    const result = await pool.query(`
      SELECT 
        ma.*,
        r.name as recipe_name,
        c.name as cook_name,
        cl.name as client_name
      FROM menu_assignments ma
      JOIN recipes r ON ma.recipe_id = r.id
      JOIN cooks c ON ma.cook_id = c.id
      LEFT JOIN clients cl ON ma.client_id = cl.id
      ORDER BY ma.assignment_date DESC, c.name ASC
    `);
    return result.rows;
  },

  // Get assignments for a specific cook and date
  async getByCookAndDate(cookId, date) {
    const result = await pool.query(`
      SELECT 
        ma.*,
        r.name as recipe_name,
        r.has_aggregate_ingredient,
        r.aggregate_ingredient_name,
        r.aggregate_ingredient_amount,
        cl.name as client_name
      FROM menu_assignments ma
      JOIN recipes r ON ma.recipe_id = r.id
      LEFT JOIN clients cl ON ma.client_id = cl.id
      WHERE ma.cook_id = $1 AND ma.assignment_date = $2
      ORDER BY r.name ASC
    `, [cookId, date]);
    return result.rows;
  },

  // Get aggregated ingredients for a cook on a specific date
  async getAggregatedIngredients(cookId, date) {
    const result = await pool.query(`
      SELECT 
        r.aggregate_ingredient_name as ingredient_name,
        SUM(ma.portions_needed * r.aggregate_ingredient_amount) as total_grams
      FROM menu_assignments ma
      JOIN recipes r ON ma.recipe_id = r.id
      WHERE ma.cook_id = $1 
        AND ma.assignment_date = $2
        AND r.has_aggregate_ingredient = true
      GROUP BY r.aggregate_ingredient_name
      ORDER BY r.aggregate_ingredient_name ASC
    `, [cookId, date]);
    return result.rows;
  },

  async create(assignmentData) {
    const { cook_id, recipe_id, client_id, assignment_date, portions_needed, notes } = assignmentData;
    const result = await pool.query(
      `INSERT INTO menu_assignments 
       (cook_id, recipe_id, client_id, assignment_date, portions_needed, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [cook_id, recipe_id, client_id, assignment_date, portions_needed, notes]
    );
    return result.rows[0];
  },

  async update(id, assignmentData) {
    const { cook_id, recipe_id, client_id, assignment_date, portions_needed, notes } = assignmentData;
    const result = await pool.query(
      `UPDATE menu_assignments SET
       cook_id = $1, recipe_id = $2, client_id = $3,
       assignment_date = $4, portions_needed = $5, notes = $6
       WHERE id = $7 RETURNING *`,
      [cook_id, recipe_id, client_id, assignment_date, portions_needed, notes, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM menu_assignments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = assignmentModel;