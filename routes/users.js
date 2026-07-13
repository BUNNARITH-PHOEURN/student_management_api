var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.list);
router.get('/new', userController.newForm);
router.get('/:id/edit', userController.editForm);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
