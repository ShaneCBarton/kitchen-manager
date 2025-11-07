const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAllAssignments);
router.get('/cook/:cookId/date/:date', assignmentController.getAssignmentsByCookAndDate);
router.get('/cook/:cookId/date/:date/aggregated', assignmentController.getAggregatedIngredients);
router.post('/', assignmentController.createAssignment);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;