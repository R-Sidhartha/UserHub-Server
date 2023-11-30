const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');

// Team-related routes
router.post('/createteam', TeamController.createTeam);
router.get('/teams/:id', TeamController.getTeamById);

module.exports = router;