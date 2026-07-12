const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// Register API
exports.register = async (req, res) => {
    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check existing email
        const [existingTeacher] = await db.promise().query(
            "SELECT * FROM teachers WHERE email = ?",
            [email]
        );


        if(existingTeacher.length > 0){
            return res.status(400).json({
                message:"Email already exists"
            });
        }


        // Encrypt password
        const hashPassword = await bcrypt.hash(password,10);


        await db.promise().query(
            `
            INSERT INTO teachers
            (name,email,password)
            VALUES (?,?,?)
            `,
            [
                name,
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


        const [teachers] = await db.promise().query(
            "SELECT * FROM teachers WHERE email = ?",
            [email]
        );

        if (teachers.length === 0) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const teacher = teachers[0];

        const checkPassword = await bcrypt.compare(
            password,
            teacher.password
        );

        if (!checkPassword) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const token = jwt.sign(
            {
                id: teacher.id,
                email: teacher.email
            },
            "teacher_secret",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successfully",
            token: token,
            user: {
                id: teacher.id,
                name: teacher.name,
                email: teacher.email
            }
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};