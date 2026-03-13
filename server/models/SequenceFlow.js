const mongoose = require('mongoose');

const sequenceFlowSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    actors: [{ type: String }],
    steps: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SequenceFlow', sequenceFlowSchema);
