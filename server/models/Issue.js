const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    title: { type: String, required: true },
    description: { type: String },
    priority: { 
      type: String, 
      required: true, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    },
    type: {
      type: String,
      required: true,
      enum: ['Bug', 'Task', 'Enhancement'],
      default: 'Task'
    },
    assignedTo: { type: String }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Issue', issueSchema);
