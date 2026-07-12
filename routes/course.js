var express = require('express');
var router = express.Router();
var courseController = require('../controllers/courseController');

router.get('/', courseController.list);
router.get('/new', courseController.newForm);
router.get('/:id', courseController.show);
router.get('/:id/edit', courseController.editForm);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.delete); 

router.post('/:id/enroll', courseController.enroll);
router.delete('/:id/unenroll/:studentId', courseController.unenroll);

module.exports = router;
