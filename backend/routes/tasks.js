const express = require('express');
const { createTask, deleteTask, listTasks, updateTask } = require('../controllers/tasksController');

const router = express.Router();

router.route('/').get(listTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;
