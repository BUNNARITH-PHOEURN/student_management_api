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

// POST /students/:id/enroll - Enroll a student in a course (PENDING - waiting for student team)
// router.post('/students/:id/enroll', function(req, res, next) {
//     var studentId = req.params.id;
//     var course_id = req.body.course_id;
//
//     if (!course_id) {
//         return res.status(400).json({ error: 'course_id is required' });
//     }
//
//     // TODO: Implement after student module is ready
// });

module.exports = router;
