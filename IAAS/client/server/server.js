const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'Advising'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});

app.post('/api/register', async (req, res) => {
    const { name, email, password, role, sex, dateOfBirth } = req.body;
    console.log("Role from client:", role);

    const allowedRoles = ['student', 'faculty', 'admin'];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Allowed roles are: student, faculty, admin' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (name, email, password, role, sex, dateOfBirth) VALUES (?, ?, ?, ?, ?, ?)';

        console.log("SQL Query:", query);
        console.log("Query Values:", [name, email, hashedPassword, role, sex, dateOfBirth]);

        connection.query(query, [name, email, hashedPassword, role, sex, dateOfBirth], (err, results) => {
            if (err) {
                console.error('Error inserting user: ', err.sqlMessage);
                return res.status(500).json({ error: 'Registration failed' });
            }
            console.log('User registered successfully');
            res.json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Registration is failed' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';

    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error querying user: ', err);
            return res.status(500).json({ error: 'Login failed' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role, sex: user.sex, dateOfBirth: user.dateOfBirth } }); // Send user data
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.listen(5001, () => {
    console.log('Server started on port 5001');
});