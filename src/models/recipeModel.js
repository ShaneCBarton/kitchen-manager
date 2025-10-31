const pool = require('../config/database');

const recipeModel = {
    async getAll() {
        const result = await pool.query(
            'SELECT * FROM recipes ORDER BY name ASC'
        );
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query(
            'SELECT * FROM recipes WHERE id = $1',
            [id]
        );
        return result.rows[0];
    },

    async create(recipeData) {
        const {
        name,
        category,
        description,
        base_portion_size,
        instructions,
        image_url
        } = recipeData;

        const result = await pool.query(
        `INSERT INTO recipes (
            name, category, description, base_portion_size, instructions, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, category, description, base_portion_size, instructions, image_url]
        );
        return result.rows[0];
    },

    async update(id, recipeData) {
        const {
        name,
        category,
        description,
        base_portion_size,
        instructions,
        image_url
        } = recipeData;

        const result = await pool.query(
        `UPDATE recipes SET
            name = $1,
            category = $2,
            description = $3,
            base_portion_size = $4,
            instructions = $5,
            image_url = $6
        WHERE id = $7
        RETURNING *`,
        [name, category, description, base_portion_size, instructions, image_url, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query(
            'DELETE FROM recipes WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
};

module.exports = recipeModel;