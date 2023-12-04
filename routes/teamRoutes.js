const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');

// Team-related routes
router.get('/', TeamController.getTeams);
router.post('/createteam', TeamController.createTeam);
router.put('/update/:id', TeamController.updateTeam);
router.get('/team/:id', TeamController.getTeamById);
router.delete('/delete/:id', TeamController.deleteTeam);

module.exports = router;