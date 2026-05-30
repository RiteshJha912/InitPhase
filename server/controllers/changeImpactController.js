const ChangeImpactAnalysis = require('../models/ChangeImpactAnalysis');
const Project = require('../models/Project');
const { fetchRepositorySnapshot } = require('../services/githubRepoService');
const {
  generateChangeImpactWithGroq,
  generateRepositorySummaryWithGroq,
  normalizeChangeImpact,
} = require('../services/groqService');

const MAX_CHANGE_REQUEST_LENGTH = 4000;

const getOwnedProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (project.user.toString() !== userId.toString()) {
    const error = new Error('User not authorized to access this project');
    error.statusCode = 401;
    throw error;
  }

  return project;
};

const sendError = (res, error) => {
  res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
};

const validateChangeRequest = (changeRequest) => {
  if (!changeRequest || !changeRequest.trim()) {
    const error = new Error('Change request is required');
    error.statusCode = 400;
    throw error;
  }

  if (changeRequest.length > MAX_CHANGE_REQUEST_LENGTH) {
    const error = new Error(`Change request must be ${MAX_CHANGE_REQUEST_LENGTH} characters or fewer`);
    error.statusCode = 400;
    throw error;
  }
};

const getProjectChangeImpact = async (req, res) => {
  try {
    await getOwnedProject(req.params.projectId, req.user._id);
    const workspace = await ChangeImpactAnalysis.findOne({ project: req.params.projectId });
    res.status(200).json(workspace || null);
  } catch (error) {
    sendError(res, error);
  }
};

const analyzeRepository = async (req, res) => {
  const { repositoryUrl } = req.body;

  try {
    if (!repositoryUrl || !repositoryUrl.trim()) {
      const error = new Error('GitHub repository URL is required');
      error.statusCode = 400;
      throw error;
    }

    await getOwnedProject(req.params.projectId, req.user._id);
    const existing = await ChangeImpactAnalysis.findOne({ project: req.params.projectId });
    const snapshot = await fetchRepositorySnapshot(repositoryUrl.trim());
    const summary = await generateRepositorySummaryWithGroq({
      repositoryUrl: repositoryUrl.trim(),
      repositoryName: snapshot.repositoryName,
      files: snapshot.files,
    });

    const repositoryChanged = existing && existing.repositoryUrl !== repositoryUrl.trim();
    const workspace = await ChangeImpactAnalysis.findOneAndUpdate(
      { project: req.params.projectId },
      {
        project: req.params.projectId,
        repositoryUrl: repositoryUrl.trim(),
        repositoryName: snapshot.repositoryName,
        defaultBranch: snapshot.defaultBranch,
        summary: {
          ...summary,
          notableFiles: snapshot.files.map(({ path, type, size }) => ({ path, type, size })),
        },
        ...(repositoryChanged ? { analyses: [] } : {}),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(workspace);
  } catch (error) {
    sendError(res, error);
  }
};

const generateImpactDraft = async (req, res) => {
  const { changeRequest } = req.body;

  try {
    validateChangeRequest(changeRequest);
    await getOwnedProject(req.params.projectId, req.user._id);

    const workspace = await ChangeImpactAnalysis.findOne({ project: req.params.projectId });
    if (!workspace?.summary?.overview) {
      const error = new Error('Analyze a repository before generating impact analysis');
      error.statusCode = 400;
      throw error;
    }

    const impact = await generateChangeImpactWithGroq({
      summary: workspace.summary,
      notableFiles: workspace.summary.notableFiles || [],
      changeRequest,
    });

    res.status(200).json({
      changeRequest,
      ...impact,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const saveImpactAnalysis = async (req, res) => {
  try {
    validateChangeRequest(req.body.changeRequest);
    await getOwnedProject(req.params.projectId, req.user._id);

    const workspace = await ChangeImpactAnalysis.findOne({ project: req.params.projectId });
    if (!workspace) {
      const error = new Error('Analyze a repository before saving impact analysis');
      error.statusCode = 400;
      throw error;
    }

    workspace.analyses.push({
      changeRequest: req.body.changeRequest,
      ...normalizeChangeImpact(req.body),
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    sendError(res, error);
  }
};

const deleteImpactAnalysis = async (req, res) => {
  try {
    await getOwnedProject(req.params.projectId, req.user._id);

    const workspace = await ChangeImpactAnalysis.findOne({ project: req.params.projectId });
    if (!workspace) {
      const error = new Error('Change impact workspace not found');
      error.statusCode = 404;
      throw error;
    }

    const analysis = workspace.analyses.id(req.params.analysisId);
    if (!analysis) {
      const error = new Error('Impact analysis not found');
      error.statusCode = 404;
      throw error;
    }

    analysis.deleteOne();
    await workspace.save();

    res.status(200).json({ message: 'Impact analysis removed successfully', id: req.params.analysisId });
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  getProjectChangeImpact,
  analyzeRepository,
  generateImpactDraft,
  saveImpactAnalysis,
  deleteImpactAnalysis,
};
