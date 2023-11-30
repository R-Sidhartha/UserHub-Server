const Team = require('../models/Team');
const User = require('../models/User');

const TeamController = {
    createTeam: async (req, res) => {
      const { userIds } = req.body;
  
      try {
        // Check if a team with the same userIds already exists
        const existingTeam = await Team.findOne({ users: { $all: userIds } });
  
        if (existingTeam) {
          return res.status(400).json({ message: 'A team with the same users already exists' });
        }
  
        // Retrieve users based on userIds
        const users = await User.find({ _id: { $in: userIds } });
  
        // Check if users have unique domains and availability
        const domainSet = new Set();
        const availabilitySet = new Set();
  
        for (const user of users) {
          if (domainSet.has(user.domain) || availabilitySet.has(user.available)) {
            return res.status(400).json({ message: 'Selected users must have unique domains and availability' });
          }
  
          domainSet.add(user.domain);
          availabilitySet.add(user.available);
        }
  
        // Create a new team
        const team = new Team({ users });
        const newTeam = await team.save();
  
        res.status(201).json(newTeam);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    getTeamById: async (req, res) => {
      try {
        const team = await Team.findById(req.params.id).populate('users', 'first_name last_name email domain available');
        if (!team) {
          return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  };

module.exports = TeamController;
