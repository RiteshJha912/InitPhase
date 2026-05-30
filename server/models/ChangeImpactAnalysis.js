const mongoose = require('mongoose');

const fetchedFileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    type: { type: String, default: '' },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

const affectedFileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    reason: { type: String, default: '' },
  },
  { _id: false }
);

const costAnalysisSchema = new mongoose.Schema(
  {
    estimatedHours: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    estimatedCostUsd: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    assumedHourlyRateUsd: { type: Number, default: 75 },
    costDrivers: [{ type: String }],
    pmNotes: [{ type: String }],
  },
  { _id: false }
);

const impactAnalysisSchema = new mongoose.Schema(
  {
    changeRequest: { type: String, required: true },
    complexity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    affectedFiles: [affectedFileSchema],
    affectedModules: [{ type: String }],
    implementationConsiderations: [{ type: String }],
    risks: [{ type: String }],
    costAnalysis: costAnalysisSchema,
  },
  { timestamps: true }
);

const changeImpactAnalysisSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project', unique: true },
    repositoryUrl: { type: String, required: true },
    repositoryName: { type: String, default: '' },
    defaultBranch: { type: String, default: '' },
    summary: {
      overview: { type: String, default: '' },
      techStack: [{ type: String }],
      architecture: { type: String, default: '' },
      majorAreas: [{ type: String }],
      notableFiles: [fetchedFileSchema],
    },
    analyses: [impactAnalysisSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ChangeImpactAnalysis', changeImpactAnalysisSchema);
