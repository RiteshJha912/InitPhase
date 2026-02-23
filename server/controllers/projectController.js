const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await Project.create({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createProject, getUserProjects, getSingleProject };
