const Team = require("../models/Team");
const User = require("../models/User");

const TeamController = {
  getTeams: async (req, res) => {
    try {
      const teams = await Team.find().populate("users");
      if (!teams) {
        return res.status(404).json({ message: "There are no teams to fetch" });
      }

      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createTeam: async (req, res) => {
    const { name, userIds } = req.body;
  
    try {
      // Check if a team with the same name already exists
      const existingTeamWithName = await Team.findOne({ name });
  if (name.length === 0) {  
    return res
    .status(400)
    .json({ message: "Name should contain atleats three Characters" });
  }
      if (existingTeamWithName) {
        return res
          .status(400)
          .json({ message: "A team with the same name already exists" });
      }
  
      let users = [];
  
      if (userIds && userIds.length > 0) {
        // Retrieve users based on userIds
        users = await User.find({ _id: { $in: userIds } });
  
        // Check if users have unique domains and availability
        const domainSet = new Set();
        const availabilitySet = new Set();
  
        for (const user of users) {
          if (domainSet.has(user.domain)) {
            return res
              .status(400)
              .json({
                message: "Selected users must have unique domains",
              });
          }
          if (!user.available) {
            return res
              .status(400)
              .json({
                message: "All selected users must be available to create a team",
              });
          }
          domainSet.add(user.domain);
          availabilitySet.add(user.available);
        }
      }
  
      // Create a new team
      const team = new Team({ name, users: users.map((user) => user._id) });
      const newTeam = await team.save();
  
      res.status(201).json(newTeam);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateTeam: async (req, res) => {
    const teamId = req.params.id;
    const { name, userIdToAdd, userIdToRemove } = req.body;

    try {
        // Check if the team exists
        const existingTeam = await Team.findById(teamId).populate("users");

        if (!existingTeam) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Retrieve the user based on userIdToAdd
        if (userIdToAdd) {
            const userToAdd = await User.findById(userIdToAdd);

            // Check if userToAdd has a unique domain and availability
            if (existingTeam.users.some((user) => user.domain === userToAdd.domain)) {
                return res.status(400).json({
                    message: "Selected user to add must have a unique domain",
                });
            }
            if (!userToAdd.available) {
                return res.status(400).json({
                    message: "The selected user must be available to add to the team",
                });
            }

            existingTeam.users.push(userToAdd);
        }

        // Remove user from the team if userIdToRemove is provided
        if (userIdToRemove) {
            if (existingTeam.users.some((user) => user._id.toString() === userIdToRemove)) {
                // Remove the user from the team
                existingTeam.users = existingTeam.users.filter((user) => user._id.toString() !== userIdToRemove);
            } else {
                return res.status(400).json({
                    message: `User with ID ${userIdToRemove} is not present in the team`,
                });
            }
        }

        // Update team properties if provided
        if (name) {
            existingTeam.name = name;
        }

        // Save the updated team
        const updatedTeam = await existingTeam.save();

        res.status(200).json(updatedTeam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
},

  
  getTeamById: async (req, res) => {
    try {
      const team = await Team.findById(req.params.id).populate(
        "users",
        "first_name last_name email domain available"
      );
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteTeam: async (req, res) => {
    const teamId = req.params.id;

    try {
      // Check if the team exists
      const existingTeam = await Team.findByIdAndDelete(teamId);

      if (!existingTeam) {
        return res.status(404).json({ message: "Team not found" });
      }

      // Delete the team

      res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = TeamController;
