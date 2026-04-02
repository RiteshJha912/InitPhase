const TestCase = require('../models/TestCase');
const Requirement = require('../models/Requirement');
const Project = require('../models/Project');
const SequenceFlow = require('../models/SequenceFlow');
const Issue = require('../models/Issue');

const getDocumentation = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to access this project' });
    }

    const requirements = await Requirement.find({ project: projectId }).lean();
    const testCases = await TestCase.find({ project: projectId }).lean();
    const sequenceFlows = await SequenceFlow.find({ project: projectId }).lean();
    const issues = await Issue.find({ project: projectId }).lean();

    let coveredRequirements = 0;

    const rtmData = requirements.map((req) => {
      const linkedTests = testCases.filter(
        (tc) => tc.requirement && tc.requirement.toString() === req._id.toString()
      );
      const totalTests = linkedTests.length;
      const passed = linkedTests.filter((tc) => tc.status === 'Pass').length;
      const failed = linkedTests.filter((tc) => tc.status === 'Fail').length;
      const coverage = totalTests > 0;
      if (coverage) coveredRequirements++;

      return {
        requirementId: req._id,
        title: req.title,
        priority: req.priority,
        totalTests,
        passed,
        failed,
        coverage,
        testCases: linkedTests
      };
    });

    const overallCoveragePercentage = requirements.length === 0 
      ? 0 
      : Math.round((coveredRequirements / requirements.length) * 100);

    const docData = {
      project: { 
        name: project.name, 
        description: project.description, 
        id: project._id 
      },
      rtmData,
      overallCoveragePercentage,
      sequenceFlows,
      issues
    };

    res.status(200).json(docData);
  } catch (error) {
    console.error('Error generating documentation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDocumentation };
