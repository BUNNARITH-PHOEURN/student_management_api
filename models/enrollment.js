var connection = require('../config/db');

var Enrollment = {
    findStudentsByCourse: function(courseId, callback) {
        var query = 'SELECT s.id, s.firstName, s.lastName, s.email, s.phoneNumber, s.gender, s.city, s.status FROM students s INNER JOIN enrollments e ON s.id = e.student_id WHERE e.course_id = ?';
        connection.query(query, [courseId], callback);
    },

    findCoursesByStudent: function(studentId, callback) {
        var query = 'SELECT c.id, c.course_name, c.course_code, c.credits, c.instructor, c.department, c.semester, c.status FROM courses c INNER JOIN enrollments e ON c.id = e.course_id WHERE e.student_id = ?';
        connection.query(query, [studentId], callback);
    },

    enroll: function(studentId, courseId, callback) {
        var query = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
        connection.query(query, [studentId, courseId], callback);
    },

    unenroll: function(studentId, courseId, callback) {
        var query = 'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?';
        connection.query(query, [studentId, courseId], callback);
    },

    isEnrolled: function(studentId, courseId, callback) {
        var query = 'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?';
        connection.query(query, [studentId, courseId], callback);
    }
};

module.exports = Enrollment;
