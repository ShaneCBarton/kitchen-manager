const clientModel = require('../models/clientModel');

const clientController = {
  async getAllClients(req, res) {
    try {
      const clients = await clientModel.getAll();
      res.json(clients);
    } catch (err) {
      console.error('Error getting clients:', err);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  },

  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await clientModel.getById(id);
      
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      res.json(client);
    } catch (err) {
      console.error('Error getting client:', err);
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  },

  async createClient(req, res) {
    try {
      const client = await clientModel.create(req.body);
      res.status(201).json(client);
    } catch (err) {
      console.error('Error creating client:', err);
      res.status(500).json({ error: 'Failed to create client' });
    }
  },

  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const client = await clientModel.update(id, req.body);
      
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      res.json(client);
    } catch (err) {
      console.error('Error updating client:', err);
      res.status(500).json({ error: 'Failed to update client' });
    }
  },

  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const client = await clientModel.delete(id);
      
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      res.json({ message: 'Client deleted successfully', client });
    } catch (err) {
      console.error('Error deleting client:', err);
      res.status(500).json({ error: 'Failed to delete client' });
    }
  }
};

module.exports = clientController;