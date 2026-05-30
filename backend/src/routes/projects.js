const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticate = require('../middleware/auth');
const { createProjectValidation, updateProjectValidation } = require('../utils/validators');

// All project routes require authentication
router.use(authenticate);

// GET /api/projects — List user's projects
router.get('/', projectController.listProjects);

// POST /api/projects — Create a new project
router.post('/', createProjectValidation, projectController.createProject);

// PUT /api/projects/:id — Update a project
router.put('/:id', updateProjectValidation, projectController.updateProject);

// DELETE /api/projects/:id — Delete a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
