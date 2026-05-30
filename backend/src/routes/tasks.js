const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const { createTaskValidation, updateTaskValidation } = require('../utils/validators');

// All task routes require authentication
router.use(authenticate);

// GET /api/projects/:projectId/tasks — List tasks in a project
// Note: This route is mounted at /api/projects/:projectId/tasks in the main app
router.get('/projects/:projectId/tasks', taskController.listTasks);

// POST /api/projects/:projectId/tasks — Create a new task in a project
router.post('/projects/:projectId/tasks', createTaskValidation, taskController.createTask);

// PUT /api/tasks/:id — Update a task
router.put('/tasks/:id', updateTaskValidation, taskController.updateTask);

// DELETE /api/tasks/:id — Delete a task
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
