class Course {
  constructor(id, course_name, course_code) {
    this.id = id;
    this.course_name = course_name;
    this.course_code = course_code;
    this.credits = 0;
    this.description = '';
    this.instructor = '';
    this.department = '';
    this.semester = '';
    this.status = 'active';
    this.created_at = null;
    this.updated_at = null;
  }
}

module.exports = Course;
