const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    requirement: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Requirement' },
    name: { type: String, required: true },
    steps: { type: String, required: true },
    expectedResult: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Pass', 'Fail'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TestCase', testCaseSchema);
