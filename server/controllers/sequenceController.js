const SequenceFlow = require('../models/SequenceFlow');
const Project = require('../models/Project');

const createSequenceFlow = async (req, res) => {
  const { title, description, actors, steps } = req.body;
  const { projectId } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Sequence title is required' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const sequenceFlow = await SequenceFlow.create({
      project: projectId,
      title,
      description: description || '',
      actors: actors || [],
      steps: steps || [],
    });

    res.status(201).json(sequenceFlow);
  } catch (error) {
    console.error('Error creating SequenceFlow:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjectSequenceFlows = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const sequences = await SequenceFlow.find({ project: projectId }).sort({ createdAt: -1 });
    res.status(200).json(sequences);
  } catch (error) {
    console.error('Error getting SequenceFlow:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteSequenceFlow = async (req, res) => {
  const { id } = req.params;

  try {
    const sequenceFlow = await SequenceFlow.findById(id);

    if (!sequenceFlow) {
      return res.status(404).json({ message: 'Sequence not found' });
    }

    const project = await Project.findById(sequenceFlow.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this sequence' });
    }

    await sequenceFlow.deleteOne();
    res.status(200).json({ message: 'Sequence removed successfully', id });
  } catch (error) {
    console.error('Error deleting SequenceFlow:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createSequenceFlow, getProjectSequenceFlows, deleteSequenceFlow };
