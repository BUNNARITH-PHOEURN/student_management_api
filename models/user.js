var connection = require('../config/db');

var User = {
    findAll: function(callback) {
        connection.query('SELECT id, name, email FROM users', callback);
    },

    findById: function(id, callback) {
        connection.query('SELECT id, name, email FROM users WHERE id = ?', [id], callback);
    },

    create: function(data, callback) {
        var query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        connection.query(query, [
            data.name || '',
            data.email || '',
            data.password || ''
        ], callback);
    },

    update: function(id, data, callback) {
        var query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        connection.query(query, [
            data.name || '',
            data.email || '',
            data.password || '',
            id
        ], callback);
    },

    delete: function(id, callback) {
        connection.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
};

module.exports = User;
