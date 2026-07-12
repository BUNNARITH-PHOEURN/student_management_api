var Teacher = require('../models/teacher');

var teacherController = {
    list: function(req, res) {
        Teacher.findAll(function(err, results) {
            if (err) return res.status(500).json({ error: err.message });

            if (req.accepts('html') && !req.query.json) {
                return res.render('index', {
                    title: 'Teachers',
                    items: results,
                    basePath: 'teachers',
                    entityLabel: 'Teacher',
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
        res.render('addTeacher', { title: 'Add Teacher' });
    },

    show: function(req, res) {
        Teacher.findById(req.params.id, function(err, results) {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'Teacher not found' });
            res.json(results[0]);
        });
    },

    editForm: function(req, res) {
        Teacher.findById(req.params.id, function(err, results) {
            if (err) return res.status(500).send(err.message);
            if (results.length === 0) return res.status(404).send('Teacher not found');
            res.render('editTeacher', { title: 'Edit Teacher', teacher: results[0] });
        });
    },

    create: function(req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email, and password are required' });
        }

        Teacher.create({ name: name, email: email, password: password }, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                message: 'Teacher added successfully',
                teacher: {
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

        Teacher.update(req.params.id, { name: name, email: email, password: password }, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Teacher not found' });
            res.json({ message: 'Teacher updated successfully' });
        });
    },

    delete: function(req, res) {
        Teacher.delete(req.params.id, function(err, result) {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Teacher not found' });
            res.json({ message: 'Teacher deleted successfully' });
        });
    }
};

module.exports = teacherController;
