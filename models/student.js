var connection = require('../config/db');
var Student = {

    // Find all students in list function
    findAll: function(callback) {
        connection.query('SELECT * FROM students', callback);
    },

    // Find specific student by ID function
    findById: function(id, callback) {
        connection.query('SELECT * FROM students WHERE id = ?', [id], callback);
    },

    //Create student function
    create: function(data, callback) {
        var query = 'INSERT INTO students (firstName, lastName, street, district, city, phoneNumber, email, dob,  gender, status) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)';
        connection.query(query, [
            data.firstName || '',
            data.lastName || '',
            data.street || '',
            data.district || '',
            data.city || '',
            data.phoneNumber || '',
            data.email || '',
            data.dob || null,
            data.gender|| '',
            data.status || 'active',
        ], callback);
    },

    // update student function
    update: function(id, data, callback) {
        var query = 'UPDATE students SET firstName = ?, lastName = ?, street = ?, district = ?, city = ?, phoneNumber = ?, email=?, dob = ?, gender = ?, status = ? WHERE id = ?';
        connection.query(query, [
            data.firstName || '',
            data.lastName || '',
            data.street || '',
            data.district || '',
            data.city || '',
            data.phoneNumber || '',
            data.email || '',
            data.dob || null,
            data.gender || '',
            data.status|| 'active',
            id
        ], callback);
    },

    //delete student function
    delete: function(id, callback) {
        connection.query('DELETE FROM students WHERE id = ?', [id], callback);
    }
};

module.exports = Student;