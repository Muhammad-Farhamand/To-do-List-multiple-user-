const express = require('express');
const todoController = require('../Controllers/todoController');

const router = express.Router();

router.route('/:user_id').get(todoController.getTasks);
router.route('/:user_id/push').post(todoController.pushTask);
router.route('/:user_id/pull').delete(todoController.pullTask);
router.route('/:user_id/update').patch(todoController.updateTask);

module.exports = router;
