const Brd = require('../models/Brd');
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');
const { generateBrdWithGroq, normalizeBrdSections } = require('../services/groqService');

const MAX_IDEA_LENGTH = 12000;

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

const getOwnedBrd = async (id, userId) => {
  const brd = await Brd.findById(id);

  if (!brd) {
    const error = new Error('BRD not found');
    error.statusCode = 404;
    throw error;
  }

  await getOwnedProject(brd.project, userId);
  return brd;
};

const sendError = (res, error) => {
  res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
};

const validateIdeaInput = ({ title, sourceIdea }) => {
  if (!title || !title.trim()) {
    const error = new Error('Idea title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!sourceIdea || !sourceIdea.trim()) {
    const error = new Error('Raw idea is required');
    error.statusCode = 400;
    throw error;
  }

  if (sourceIdea.length > MAX_IDEA_LENGTH) {
    const error = new Error(`Raw idea must be ${MAX_IDEA_LENGTH} characters or fewer`);
    error.statusCode = 400;
    throw error;
  }
};

const generateBrdDraft = async (req, res) => {
  const { projectId } = req.params;
  const { title, sourceIdea, targetUsers, businessGoals, constraints } = req.body;

  try {
    validateIdeaInput({ title, sourceIdea });
    const project = await getOwnedProject(projectId, req.user._id);
    const sections = await generateBrdWithGroq({
      project,
      title,
      sourceIdea,
      targetUsers,
      businessGoals,
      constraints,
    });

    res.status(200).json({
      title,
      sourceIdea,
      targetUsers: targetUsers || '',
      businessGoals: businessGoals || '',
      constraints: constraints || '',
      status: 'Draft',
      sections,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const createBrd = async (req, res) => {
  const { projectId } = req.params;
  const { title, sourceIdea, targetUsers, businessGoals, constraints, sections } = req.body;

  try {
    validateIdeaInput({ title, sourceIdea });
    await getOwnedProject(projectId, req.user._id);

    const brd = await Brd.create({
      project: projectId,
      title,
      sourceIdea,
      targetUsers: targetUsers || '',
      businessGoals: businessGoals || '',
      constraints: constraints || '',
      status: 'Saved',
      sections: normalizeBrdSections(sections),
    });

    res.status(201).json(brd);
  } catch (error) {
    sendError(res, error);
  }
};

const getProjectBrds = async (req, res) => {
  const { projectId } = req.params;

  try {
    await getOwnedProject(projectId, req.user._id);
    const brds = await Brd.find({ project: projectId }).sort({ createdAt: -1 });
    res.status(200).json(brds);
  } catch (error) {
    sendError(res, error);
  }
};

const getBrdById = async (req, res) => {
  try {
    const brd = await getOwnedBrd(req.params.id, req.user._id);
    res.status(200).json(brd);
  } catch (error) {
    sendError(res, error);
  }
};

const deleteBrd = async (req, res) => {
  try {
    const brd = await getOwnedBrd(req.params.id, req.user._id);
    await brd.deleteOne();
    res.status(200).json({ message: 'BRD removed successfully', id: req.params.id });
  } catch (error) {
    sendError(res, error);
  }
};

const convertBrdRequirements = async (req, res) => {
  try {
    const brd = await getOwnedBrd(req.params.id, req.user._id);
    const functionalRequirements = brd.sections?.functionalRequirements || [];

    if (functionalRequirements.length === 0) {
      return res.status(400).json({ message: 'BRD has no functional requirements to convert' });
    }

    const createdRequirements = await Requirement.insertMany(
      functionalRequirements.map((item) => ({
        project: brd.project,
        title: item.description ? `${item.title}: ${item.description}` : item.title,
        priority: item.priority || 'Should-Have',
      }))
    );

    brd.status = 'Converted';
    await brd.save();

    res.status(201).json({
      message: 'BRD functional requirements converted successfully',
      requirements: createdRequirements,
      brd,
    });
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  generateBrdDraft,
  createBrd,
  getProjectBrds,
  getBrdById,
  deleteBrd,
  convertBrdRequirements,
};
