const { validationResult } = require('express-validator');
const { Task, Project } = require('../models');

/**
 * Verify that a project belongs to the authenticated user.
 * Returns the project if found, or null.
 */
const verifyProjectOwnership = async (projectId, userId) => {
  return Project.findOne({
    where: { id: projectId, user_id: userId },
  });
};

/**
 * GET /api/projects/:projectId/tasks
 * List all tasks in a project (with ownership check)
 */
const listTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await verifyProjectOwnership(projectId, req.user.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const tasks = await Task.findAll({
      where: { project_id: projectId },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects/:projectId/tasks
 * Create a new task in a project (with ownership check)
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { projectId } = req.params;
    const { title, due_date } = req.body;

    // Verify project ownership
    const project = await verifyProjectOwnership(projectId, req.user.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    const task = await Task.create({
      title,
      due_date: due_date || null,
      project_id: projectId,
    });

    res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task (with project ownership check)
 */
const updateTask = async (req, res, next) => {
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
    const { title, status, due_date } = req.body;

    // Find the task with its project
    const task = await Task.findByPk(id, {
      include: [{ model: Project, as: 'project' }],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify project ownership
    if (task.project.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    await task.update({
      ...(title !== undefined && { title }),
      ...(status !== undefined && { status }),
      ...(due_date !== undefined && { due_date }),
    });

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task (with project ownership check)
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the task with its project
    const task = await Task.findByPk(id, {
      include: [{ model: Project, as: 'project' }],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify project ownership
    if (task.project.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      data: { message: 'Task deleted successfully.' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
