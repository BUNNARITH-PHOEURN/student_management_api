var Course = require('../models/course');

var courseController = {
    list: function(req, res) {
        Course.findAll(function(err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (req.accepts('html') && !req.query.json) {
                return res.render('index', { title: 'Courses', courses: results });
            }
            res.json(results);
        });
    },

    newForm: function(req, res) {
        res.render('addCourse', { title: 'Add Course' });
    },

    show: function(req, res) {
        Course.findById(req.params.id, function(err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json(results[0]);
        });
    },

    editForm: function(req, res) {
        Course.findById(req.params.id, function(err, results) {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (results.length === 0) {
                return res.status(404).send('Course not found');
            }
            res.render('editCourse', {
                title: 'Edit Course',
                course: results[0],
                students: [
                    { name: 'Vimean', student_id: 'STU-001' },
                    { name: 'Nith', student_id: 'STU-002' },
                    { name: 'TaTe', student_id: 'STU-003' }
                ]
            });
        });
    },

    create: function(req, res) {
        var course_name = req.body.course_name;
        var course_code = req.body.course_code;
        var credits = req.body.credits;
        var description = req.body.description;
        var instructor = req.body.instructor;
        var department = req.body.department;
        var semester = req.body.semester;
        var status = req.body.status;

        if (!course_name || !course_code) {
            return res.status(400).json({ error: 'course_name and course_code are required' });
        }

        Course.create({
            course_name: course_name,
            course_code: course_code,
            credits: credits,
            description: description,
            instructor: instructor,
            department: department,
            semester: semester,
            status: status
        }, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: 'Course added successfully',
                course: {
                    id: result.insertId,
                    course_name: course_name,
                    course_code: course_code,
                    credits: credits || 0,
                    description: description || '',
                    instructor: instructor || '',
                    department: department || '',
                    semester: semester || '',
                    status: status || 'active',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        });
    },

    update: function(req, res) {
        var course_name = req.body.course_name;
        var course_code = req.body.course_code;
        var credits = req.body.credits;
        var description = req.body.description;
        var instructor = req.body.instructor;
        var department = req.body.department;
        var semester = req.body.semester;
        var status = req.body.status;

        if (!course_name || !course_code) {
            return res.status(400).json({ error: 'course_name and course_code are required' });
        }

        Course.update(req.params.id, {
            course_name: course_name,
            course_code: course_code,
            credits: credits,
            description: description,
            instructor: instructor,
            department: department,
            semester: semester,
            status: status
        }, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json({ message: 'Course updated successfully' });
        });
    },

    delete: function(req, res) {
        Course.delete(req.params.id, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }
            res.json({ message: 'Course deleted successfully' });
        });
    }
};

module.exports = courseController;
