class Student {
  constructor(id, firstName, lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = '';
    this.street = '';
    this.district = '';
    this.city = '';
    this.phoneNumber = '';
    this.email = '';
    this.dob = null;
    this.status = 'active';
    this.created_at = null;
    this.updated_at = null;
  }
}

module.exports = Student;