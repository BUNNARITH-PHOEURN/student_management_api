var express = require('express');
var router = express.Router();
var teacherController = require('../controllers/teacherController');

router.get('/', teacherController.list);
router.get('/new', teacherController.newForm);
router.get('/:id/edit', teacherController.editForm);
router.get('/:id', teacherController.show);
router.post('/', teacherController.create);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.delete);

module.exports = router;
