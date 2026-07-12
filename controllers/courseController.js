var Course = require('../models/course');
var Student = require('../models/student');
var Enrollment = require('../models/enrollment');

var courseController = {

    list: function(req, res) {
        Course.findAll(function(err, results) {
            if (err) return res.status(500).json({ error: err.message });
            if (req.accepts('html') && !req.query.json) {
                return res.render('index', {
                    title: 'Courses',
                    items: results,
                    basePath: 'courses',
                    entityLabel: 'Course',
                    idField: 'id',
                    columns: [
                        { label: 'ID', field: 'id' },
                        { label: 'Course Name', field: 'course_name' },
                        { label: 'Course Code', field: 'course_code' },
                        { label: 'Credits', field: 'credits' },
                        { label: 'Instructor', field: 'instructor' },
                        { label: 'Department', field: 'department' },
                        { label: 'Semester', field: 'semester' },
                        { label: 'Status', field: 'status' }
                    ]
                });
            }
            res.json(results);
        });
    },

    // list: function(req, res) {
    //     Course.findAll(function(err, results) {
    //         if (err) {
    //             return res.status(500).json({ error: err.message });
    //         }
    //         if (req.accepts('html') && !req.query.json) {
    //             return res.render('index', { title: 'Courses', courses: results });
    //         }
    //         res.json(results);
    //     });
    // },

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
            Enrollment.findStudentsByCourse(req.params.id, function(err, enrolledStudents) {
                if (err) {
                    return res.status(500).send(err.message);
                }
                Student.findAll(function(err, allStudents) {
                    if (err) {
                        return res.status(500).send(err.message);
                    }
                    var mappedStudents = enrolledStudents.map(function(s) {
                        return {
                            id: s.id,
                            name: s.firstName + ' ' + s.lastName,
                            phoneNumber: s.phoneNumber
                        };
                    });
                    var availableStudents = allStudents.filter(function(s) {
                        return !enrolledStudents.some(function(e) { return e.Id === s.Id; });
                    }).map(function(s) {
                        return {
                            id: s.id,
                            name: s.firstName + ' ' + s.lastName
                        };
                    });
                    res.render('editCourse', {
                        title: 'Edit Course',
                        course: results[0],
                        students: mappedStudents,
                        availableStudents: availableStudents
                    });
                });
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
    },

    enroll: function(req, res) {
        var courseId = req.params.id;
        var studentId = req.body.student_id;

        if (!studentId) {
            return res.status(400).json({ error: 'student_id is required' });
        }

        Enrollment.isEnrolled(studentId, courseId, function(err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Student is already enrolled in this course' });
            }
            Enrollment.enroll(studentId, courseId, function(err, result) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Student enrolled successfully' });
            });
        });
    },

    unenroll: function(req, res) {
        var courseId = req.params.id;
        var studentId = req.params.studentId;

        Enrollment.unenroll(studentId, courseId, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Enrollment not found' });
            }
            res.json({ message: 'Student unenrolled successfully' });
        });
    }
};

module.exports = courseController;
