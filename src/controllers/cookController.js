const cookModel = require('../models/cookModel');

const cookController = {
  async getAllCooks(req, res) {
    try {
      const cooks = await cookModel.getAll();
      res.json(cooks);
    } catch (err) {
      console.error('Error getting cooks:', err);
      res.status(500).json({ error: 'Failed to fetch cooks' });
    }
  },

  async getCookById(req, res) {
    try {
      const { id } = req.params;
      const cook = await cookModel.getById(id);
      
      if (!cook) {
        return res.status(404).json({ error: 'Cook not found' });
      }
      
      res.json(cook);
    } catch (err) {
      console.error('Error getting cook:', err);
      res.status(500).json({ error: 'Failed to fetch cook' });
    }
  },

  async createCook(req, res) {
    try {
      const cook = await cookModel.create(req.body);
      res.status(201).json(cook);
    } catch (err) {
      console.error('Error creating cook:', err);
      res.status(500).json({ error: 'Failed to create cook' });
    }
  },

  async updateCook(req, res) {
    try {
      const { id } = req.params;
      const cook = await cookModel.update(id, req.body);
      
      if (!cook) {
        return res.status(404).json({ error: 'Cook not found' });
      }
      
      res.json(cook);
    } catch (err) {
      console.error('Error updating cook:', err);
      res.status(500).json({ error: 'Failed to update cook' });
    }
  },

  async deleteCook(req, res) {
    try {
      const { id } = req.params;
      const cook = await cookModel.delete(id);
      
      if (!cook) {
        return res.status(404).json({ error: 'Cook not found' });
      }
      
      res.json({ message: 'Cook deleted successfully', cook });
    } catch (err) {
      console.error('Error deleting cook:', err);
      res.status(500).json({ error: 'Failed to delete cook' });
    }
  }
};

module.exports = cookController;