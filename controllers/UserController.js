const User = require("../models/User");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      let {
        page = 1,
        limit = 20,
        domain,
        gender,
        available,
        search,
      } = req.query;

      // Pagination
      page = parseInt(page);
      limit = parseInt(limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      // Building the query object
      const query = {};
      if (domain) query.domain = domain;
      if (gender) query.gender = gender;
      if (available !== undefined) query.available = available;
      if (search) query.$text = { $search: search };

      // Filtering
      const users = await User.find(query).skip(startIndex).limit(limit);

      const totalUsers = await User.countDocuments(query);

      res.json({
        users,
        pageInfo: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    const userData = req.body;

    // Check if 'id' is provided in the request body
    if ("id" in userData) {
      return res
        .status(400)
        .json({
          message:
            "Please do not provide 'id' in the request body. It will be automatically calculated.",
        });
    }
    try {
      // Find the maximum id in the current collection
      const maxIdUser = await User.findOne({}, { id: 1 }, { sort: { id: -1 } });

      // Calculate the new id
      const newId = maxIdUser ? maxIdUser.id + 1 : 1;

      // Create the new user with the calculated id
      const newUser = await User.create({ ...userData, id: newId });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const updatedUserData = req.body;
    // Check if 'id' is provided in the updated data
    if ("id" in updatedUserData) {
      return res.status(400).json({ message: "Cannot update 'id' field" });
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      // Find the user to be deleted
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find all users with an ID greater than the deleted user's ID
      const usersToUpdate = await User.find({ id: { $gt: deletedUser.id } });

      // Update the IDs of subsequent users
      for (const userToUpdate of usersToUpdate) {
        userToUpdate.id = userToUpdate.id - 1;
        await userToUpdate.save();
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = UserController;
