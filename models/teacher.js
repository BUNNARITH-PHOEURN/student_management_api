var connection = require('../config/db');

var Teacher = {
    findAll: function(callback) {
        connection.query('SELECT id, name, email FROM teachers', callback);
    },

    findById: function(id, callback) {
        connection.query('SELECT id, name, email FROM teachers WHERE id = ?', [id], callback);
    },

    create: function(data, callback) {
        var query = 'INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)';
        connection.query(query, [
            data.name || '',
            data.email || '',
            data.password || ''
        ], callback);
    },

    update: function(id, data, callback) {
        var query = 'UPDATE teachers SET name = ?, email = ?, password = ? WHERE id = ?';
        connection.query(query, [
            data.name || '',
            data.email || '',
            data.password || '',
            id
        ], callback);
    },

    delete: function(id, callback) {
        connection.query('DELETE FROM teachers WHERE id = ?', [id], callback);
    }
};

module.exports = Teacher;
