const TestCase = require('../models/TestCase');
const Requirement = require('../models/Requirement');
const Project = require('../models/Project');

const createTestCase = async (req, res) => {
  const { name, steps, expectedResult } = req.body;
  const { projectId, requirementId } = req.params;

  if (!name || !steps || !expectedResult) {
    return res.status(400).json({ message: 'Name, steps, and expectedResult are required' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const requirement = await Requirement.findById(requirementId);
    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    if (requirement.project.toString() !== projectId) {
      return res.status(400).json({ message: 'Requirement does not belong to the specified project' });
    }

    const testCase = await TestCase.create({
      project: projectId,
      requirement: requirementId,
      name,
      steps,
      expectedResult,
      status: 'Pending',
    });

    res.status(201).json(testCase);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjectTestCases = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const testCases = await TestCase.find({ project: projectId })
      .populate('requirement', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(testCases);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateTestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Pass', 'Fail'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const testCase = await TestCase.findById(id);
    if (!testCase) {
      return res.status(404).json({ message: 'TestCase not found' });
    }

    const project = await Project.findById(testCase.project);
    if (!project) {
      return res.status(404).json({ message: 'Parent project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to modify this testcase' });
    }

    testCase.status = status;
    const updatedTestCase = await testCase.save();

    res.status(200).json(updatedTestCase);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createTestCase, getProjectTestCases, updateTestStatus };
