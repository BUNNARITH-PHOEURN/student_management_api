var connection = require('../config/db');

var Course = {
    findAll: function(callback) {
        connection.query('SELECT * FROM courses', callback);
    },

    findById: function(id, callback) {
        connection.query('SELECT * FROM courses WHERE id = ?', [id], callback);
    },

    create: function(data, callback) {
        var query = 'INSERT INTO courses (course_name, course_code, credits, description, instructor, department, semester, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [
            data.course_name,
            data.course_code,
            data.credits || 0,
            data.description || '',
            data.instructor || '',
            data.department || '',
            data.semester || '',
            data.status || 'active'
        ], callback);
    },

    update: function(id, data, callback) {
        var query = 'UPDATE courses SET course_name = ?, course_code = ?, credits = ?, description = ?, instructor = ?, department = ?, semester = ?, status = ? WHERE id = ?';
        connection.query(query, [
            data.course_name,
            data.course_code,
            data.credits || 0,
            data.description || '',
            data.instructor || '',
            data.department || '',
            data.semester || '',
            data.status || 'active',
            id
        ], callback);
    },

    delete: function(id, callback) {
        connection.query('DELETE FROM courses WHERE id = ?', [id], callback);
    }
};

module.exports = Course;
