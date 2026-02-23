const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    title: { type: String, required: true },
    priority: { 
      type: String, 
      required: true, 
      enum: ['Must-Have', 'Should-Have', 'Nice-to-Have'],
      default: 'Should-Have'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Requirement', requirementSchema);
