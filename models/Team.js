const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true  }],
  });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
