const pool = require('../config/database');

const cookModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM cooks ORDER BY name ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM cooks WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(cookData) {
    const { name, email } = cookData;
    const result = await pool.query(
      'INSERT INTO cooks (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  },

  async update(id, cookData) {
    const { name, email } = cookData;
    const result = await pool.query(
      'UPDATE cooks SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM cooks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = cookModel;