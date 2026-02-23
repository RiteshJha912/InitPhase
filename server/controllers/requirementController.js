const Requirement = require('../models/Requirement');
const Project = require('../models/Project');

const createRequirement = async (req, res) => {
  const { title, priority } = req.body;
  const { projectId } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Requirement title is required' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const requirement = await Requirement.create({
      project: projectId,
      title,
      priority: priority || 'Should-Have',
    });

    res.status(201).json(requirement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjectRequirements = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const requirements = await Requirement.find({ project: projectId }).sort({ createdAt: -1 });
    res.status(200).json(requirements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteRequirement = async (req, res) => {
  const { id } = req.params;

  try {
    const requirement = await Requirement.findById(id);

    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    const project = await Project.findById(requirement.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this requirement' });
    }

    await requirement.deleteOne();
    res.status(200).json({ message: 'Requirement removed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createRequirement, getProjectRequirements, deleteRequirement };
