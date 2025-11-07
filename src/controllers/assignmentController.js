const assignmentModel = require('../models/assignmentModel');

const assignmentController = {
  async getAllAssignments(req, res) {
    try {
      const assignments = await assignmentModel.getAll();
      res.json(assignments);
    } catch (err) {
      console.error('Error getting assignments:', err);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  },

  async getAssignmentsByCookAndDate(req, res) {
    try {
      const { cookId, date } = req.params;
      const assignments = await assignmentModel.getByCookAndDate(cookId, date);
      res.json(assignments);
    } catch (err) {
      console.error('Error getting assignments:', err);
      res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  },

  async getAggregatedIngredients(req, res) {
    try {
      const { cookId, date } = req.params;
      const ingredients = await assignmentModel.getAggregatedIngredients(cookId, date);
      res.json(ingredients);
    } catch (err) {
      console.error('Error getting aggregated ingredients:', err);
      res.status(500).json({ error: 'Failed to fetch aggregated ingredients' });
    }
  },

  async createAssignment(req, res) {
    try {
      const assignment = await assignmentModel.create(req.body);
      res.status(201).json(assignment);
    } catch (err) {
      console.error('Error creating assignment:', err);
      res.status(500).json({ error: 'Failed to create assignment' });
    }
  },

  async updateAssignment(req, res) {
    try {
      const { id } = req.params;
      const assignment = await assignmentModel.update(id, req.body);
      
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      
      res.json(assignment);
    } catch (err) {
      console.error('Error updating assignment:', err);
      res.status(500).json({ error: 'Failed to update assignment' });
    }
  },

  async deleteAssignment(req, res) {
    try {
      const { id } = req.params;
      const assignment = await assignmentModel.delete(id);
      
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      
      res.json({ message: 'Assignment deleted successfully', assignment });
    } catch (err) {
      console.error('Error deleting assignment:', err);
      res.status(500).json({ error: 'Failed to delete assignment' });
    }
  }
};

module.exports = assignmentController;