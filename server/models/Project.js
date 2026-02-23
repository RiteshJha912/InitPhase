const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
