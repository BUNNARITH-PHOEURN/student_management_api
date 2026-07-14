const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


// Register API
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [existingUser] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashPassword]
        );

        res.status(201).json({
            message: "Register successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};



// Login API
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const user = users[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({
                message: "Email or password incorrect"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET || "user_secret",
            {
                expiresIn: "1d"
            }
        );

        res.cookie('sms_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Login successfully",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('sms_token');
    res.status(204).end();
};
