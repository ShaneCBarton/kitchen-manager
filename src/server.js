const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cookRoutes = require('./routes/cookRoutes');
const clientRoutes = require('./routes/clientRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cooks', cookRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});