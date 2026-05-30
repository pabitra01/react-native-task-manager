const { validationResult } = require('express-validator');
const { Project, Task } = require('../models');

/**
 * GET /api/projects
 * List all projects for the authenticated user
 */
const listProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'title', 'status', 'due_date'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects
 * Create a new project
 */
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      user_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 * Update a project (only if owned by user)
 */
const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { title, description } = req.body;

    const project = await Project.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    await project.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    });

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Delete a project (only if owned by user)
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      data: { message: 'Project deleted successfully.' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
};
