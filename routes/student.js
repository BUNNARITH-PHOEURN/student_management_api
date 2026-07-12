var express = require('express');
var router = express.Router();
var studentController = require('../controllers/studentController');

router.get('/', studentController.list);
router.get('/new', studentController.newForm);
router.get('/:id/edit', studentController.editForm);   // ← Edit page
router.get('/:id', studentController.show);
router.post('/', studentController.create);
router.put('/:id', studentController.update);           // ← Update
router.delete('/:id', studentController.delete);        // ← Delete

module.exports = router;