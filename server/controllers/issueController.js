const Issue = require('../models/Issue');
const Project = require('../models/Project');

const createIssue = async (req, res) => {
  const { title, description, priority, status, type, assignedTo } = req.body;
  const { projectId } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Issue title is required' });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const issue = await Issue.create({
      project: projectId,
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Open',
      type: type || 'Task',
      assignedTo
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjectIssues = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const issues = await Issue.find({ project: projectId }).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const project = await Project.findById(issue.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this issue' });
    }

    issue.status = status;
    await issue.save();

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const project = await Project.findById(issue.project);

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this issue' });
    }

    await issue.deleteOne();
    res.status(200).json({ message: 'Issue removed successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createIssue, getProjectIssues, updateIssueStatus, deleteIssue };
