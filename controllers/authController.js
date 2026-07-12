const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// Register API
exports.register = async (req, res) => {
    try {

        const {
            student_name,
            email,
            password
        } = req.body;


        // Check existing email
        const [existingStudent] = await db.promise().query(
            "SELECT * FROM students WHERE email = ?",
            [email]
        );


        if(existingStudent.length > 0){
            return res.status(400).json({
                message:"Email already exists"
            });
        }


        // Encrypt password
        const hashPassword = await bcrypt.hash(password,10);


        await db.promise().query(
            `
            INSERT INTO students
            (student_name,email,password)
            VALUES (?,?,?)
            `,
            [
                student_name,
                email,
                hashPassword
            ]
        );


        res.status(201).json({
            message:"Register successfully"
        });


    } catch(error){

        res.status(500).json({
            error:error.message
        });

    }
};



// Login API
exports.login = async(req,res)=>{

    try{

        const {
            email,
            password
        } = req.body;


        const [students] = await db.promise().query(
            "SELECT * FROM students WHERE email=?",
            [email]
        );


        if(students.length === 0){

            return res.status(401).json({
                message:"Email or password incorrect"
            });

        }


        const student = students[0];


        const checkPassword = await bcrypt.compare(
            password,
            student.password
        );


        if(!checkPassword){

            return res.status(401).json({
                message:"Email or password incorrect"
            });

        }


        const token = jwt.sign(
            {
                id:student.id,
                email:student.email
            },
            "student_secret",
            {
                expiresIn:"1d"
            }
        );


        res.json({

            message:"Login successfully",

            token:token,

            student:{
                id:student.id,
                name:student.student_name,
                email:student.email
            }

        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};