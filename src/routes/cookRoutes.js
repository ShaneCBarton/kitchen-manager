const express = require('express');
const router = express.Router();
const cookController = require('../controllers/cookController');

router.get('/', cookController.getAllCooks);
router.get('/:id', cookController.getCookById);
router.post('/', cookController.createCook);
router.put('/:id', cookController.updateCook);
router.delete('/:id', cookController.deleteCook);

module.exports = router;