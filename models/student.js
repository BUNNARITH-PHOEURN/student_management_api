var connection = require('../config/db');
var Student = {
    findAll: function(callback) {
        connection.query('SELECT * FROM students', callback);
    },

    findById: function(id, callback) {
        connection.query('SELECT * FROM students WHERE id = ?', [id], callback);
    },

    create: function(data, callback) {
        var query = 'INSERT INTO students (firstName, lastName, street, district, city, phoneNumber, dob,  gender, status) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)';
        connection.query(query, [
            data.firstName || '',
            data.lastName || '',
            data.street || '',
            data.district || '',
            data.city || '',
            data.phoneNumber || '',
            data.dob || null,
            data.gender|| '',
            data.status || 'active',
        ], callback);
    },

    update: function(id, data, callback) {
        var query = 'UPDATE students SET firstName = ?, lastName = ?, street = ?, district = ?, city = ?, phoneNumber = ?, dob = ?, gender = ?, status = ? WHERE id = ?';
        connection.query(query, [
            data.firstName || '',
            data.lastName || '',
            data.street || '',
            data.district || '',
            data.city || '',
            data.phoneNumber || '',
            data.dob || null,
            data.gender || '',
            data.status|| 'active',
            id
        ], callback);
    },

    delete: function(id, callback) {
        connection.query('DELETE FROM students WHERE id = ?', [id], callback);
    }
};

module.exports = Student;