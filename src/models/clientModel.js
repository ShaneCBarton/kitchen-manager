const pool = require('../config/database');

const clientModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM clients ORDER BY name ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(clientData) {
    const { name, dietary_notes } = clientData;
    const result = await pool.query(
      'INSERT INTO clients (name, dietary_notes) VALUES ($1, $2) RETURNING *',
      [name, dietary_notes]
    );
    return result.rows[0];
  },

  async update(id, clientData) {
    const { name, dietary_notes } = clientData;
    const result = await pool.query(
      'UPDATE clients SET name = $1, dietary_notes = $2 WHERE id = $3 RETURNING *',
      [name, dietary_notes, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = clientModel;