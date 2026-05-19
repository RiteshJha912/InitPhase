const mongoose = require('mongoose');

const functionalRequirementSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['Must-Have', 'Should-Have', 'Nice-to-Have'],
      default: 'Should-Have',
    },
  },
  { _id: false }
);

const brdSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    title: { type: String, required: true },
    sourceIdea: { type: String, required: true },
    targetUsers: { type: String, default: '' },
    businessGoals: { type: String, default: '' },
    constraints: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Saved', 'Converted'],
      default: 'Saved',
    },
    sections: {
      executiveSummary: { type: String, default: '' },
      problemStatement: { type: String, default: '' },
      businessObjectives: [{ type: String }],
      stakeholders: [{ type: String }],
      scope: [{ type: String }],
      outOfScope: [{ type: String }],
      functionalRequirements: [functionalRequirementSchema],
      nonFunctionalRequirements: [{ type: String }],
      assumptions: [{ type: String }],
      risks: [{ type: String }],
      successMetrics: [{ type: String }],
      openQuestions: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Brd', brdSchema);
