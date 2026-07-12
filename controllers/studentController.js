var Student = require('../models/student');
function formatDob(dob) {
    if (!dob) return '';
    var d = new Date(dob);
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    var yyyy = d.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}

var studentController = {

    // List of students
    list: function(req, res) {
        Student.findAll(function(err, results) {
            if (err) return res.status(500).json({ error: err.message });

            results.forEach(function(s) {
                s.dob = formatDob(s.dob);
            });

            if (req.accepts('html') && !req.query.json) {
                return res.render('index', {
                    title: 'Students',
                    items: results,
                    basePath: 'students',
                    entityLabel: 'Student',
                    idField: 'id',
                    columns: [
                        { label: 'ID', field: 'id' },
                        { label: 'First Name', field: 'firstName' },
                        { label: 'Last Name', field: 'lastName' },
                        { label: 'Gender', field: 'gender' },
                        { label: 'City', field: 'city' },
                        { label: 'Phone Number', field: 'phoneNumber' },
                        { label: 'Email', field: 'email' },
                        { label: 'Date of Birth', field: 'dob' },
                        { label: 'Status', field: 'status' }
                    ]
                });
            }
            res.json(results);
        });
    },
    // list: function(req, res) {
    //     Student.findAll(function(err, results) {
    //         if (err) {
    //             return res.status(500).json({ error: err.message });
    //         }
    //         if (req.accepts('html') && !req.query.json) {
    //             return res.render('index', { title: 'Students', students: results });
    //         }
    //         res.json(results);
    //     });
    // },
    
    newForm: function(req, res) {
        res.render('addStudent', { title: 'Add Student' });
    },
    show: function(req, res) {
        Student.findById(req.params.id, function(err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }
            if (req.accepts('html') && !req.query.json) {
                var student = results[0];
                if (student.dob) {
                    student.dob = new Date(student.dob).toISOString().split('T')[0];
                }
                return res.render('showStudent', { title: 'Student Details', student: student });
            }
            res.json(results[0]);
        });
    },

    editForm: function(req, res) {
        Student.findById(req.params.id, function(err, results) {
            if (err) return res.status(500).send(err.message);
            if (results.length === 0) return res.status(404).send('Student not found');

            var student = results[0];
            if (student.dob) {
                student.dob = new Date(student.dob).toISOString().split('T')[0];
            }
            res.render('editStudent', { title: 'Edit Student', student: student });
        });
    },

    create: function(req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var gender = req.body.gender;
        var street = req.body.street;
        var district = req.body.district;
        var city = req.body.city;
        var phoneNumber = req.body.phoneNumber;
        var email = req.body.email;
        var dob = req.body.dob;
        var status = req.body.status;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'firstName and lastName are required' });
        }

        Student.create({
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            street: street,
            district: district,
            city: city,
            phoneNumber: phoneNumber,
            email: email,
            dob: dob,
            status:status
        }, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: 'Student added successfully',
                student: {
                    Id: result.insertId,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender || '',
                    street: street || '',
                    district: district || '',
                    city: city || '',
                    phoneNumber: phoneNumber || '',
                    email: email || '',
                    dob: dob || null,
                    status: status || 'active',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
        });
    },

    update: function(req, res) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var gender = req.body.gender;
        var street = req.body.street;
        var district = req.body.district;
        var city = req.body.city;
        var phoneNumber = req.body.phoneNumber;
        var email = req.body.email;
        var dob = req.body.dob;
        var status = req.body.status;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: 'firstName and lastName are required' });
        }

        Student.update(req.params.id, {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            street: street,
            district: district,
            city: city,
            phoneNumber: phoneNumber,
            email: email,
            dob: dob,
            status: status
        }, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.json({ message: 'Student updated successfully' });
        });
    },

    delete: function(req, res) {
        Student.delete(req.params.id, function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }
            res.json({ message: 'Student deleted successfully' });
        });
    }
};

module.exports = studentController;