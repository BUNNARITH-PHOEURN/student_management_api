var User = require('../models/user');

var userController = {
    list: function(req, res) {
        User.findAll(function(err, results) {
            if (err) return res.status(500).json({ error: err.message });

            if (req.accepts('html') && !req.query.json) {
                return res.render('index', {
                    title: 'Users',
                    items: results,
                    basePath: 'users',
                    entityLabel: 'User',
                    idField: 'id',
                    columns: [
                        { label: 'ID', field: 'id' },
                        { label: 'Name', field: 'name' },
                        { label: 'Email', field: 'email' }
                    ]
                });
            }
            res.json(results);
        });
    },

    newForm: function(req, res) {
        res.render('addUser', { title: 'Add User' });
    },

    show: function(req, res) {
        User.findById(req.params.id, function(err, results) {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });
            res.render('showUser', { title: 'User Details', user: results[0] });
        });
    },

    editForm: function(req, res) {
        User.findById(req.params.id, function(err, results) {
            if (err) return res.status(500).send(err.message);
            if (results.length === 0) return res.status(404).send('User not found');
            res.render('editUser', { title: 'Edit User', user: results[0] });
        });
    },

    create: function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email, and password are required' });
        }

        User.create({ name: name, email: email, password: password }, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                message: 'User added successfully',
                user: {
                    id: result.insertId,
                    name: name,
                    email: email,
                    password: password,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        });
    },

    update: function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email, and password are required' });
        }

        User.update(req.params.id, { name: name, email: email, password: password }, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'User updated successfully' });
        });
    },

    delete: function(req, res) {
        User.delete(req.params.id, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: 'User deleted successfully' });
        });
    }
};

module.exports = userController;
