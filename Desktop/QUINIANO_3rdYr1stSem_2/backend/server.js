const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db2'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Register user
app.post('/register', async (req, res) => {
    const { username, password, fname, lname, email, cell_no } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) return res.status(500).send(err);

            const userId = result.insertId;

            db.query('INSERT INTO employee_profile (user_id, fname, lname, email) VALUES (?, ?, ?, ?)', [userId, fname, lname, email], (err, result) => {
                    if (err) return res.status(500).send(err);
                }
            );

            db.query('INSERT INTO contact_no (user_id, cell_no) VALUES (?, ?)', [userId, cell_no], (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(201).send('User registered successfully');
            }
        );
        }
    );
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('User not found');

        const user = result[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(401).send('Invalid credentials');

        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({ token, userId: user.id }); // Return token and userId
    });
});


// Fetch user profile
app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    console.log('Fetching profile for user ID:', userId);  // Debugging

    db.query('SELECT users.username, employee_profile.fname, employee_profile.lname, employee_profile.email, contact_no.cell_no FROM users JOIN employee_profile ON users.id = employee_profile.user_id JOIN contact_no ON users.id = contact_no.user_id WHERE users.id = ?', [userId], (err, result) => {
            if (err) {
                console.error('Error fetching profile:', err);
                return res.status(500).send('Error fetching profile');
            }
            if (result.length === 0) return res.status(404).send('Profile not found');
            console.log('Profile data:', result[0]);  // Check if data is being returned
            res.status(200).json(result[0]);
        }
    );
});

// Update user and profile
app.put('/update/:id', (req, res) => {
    const userId = req.params.id;
    const { username, fname, lname, email, cell_no } = req.body;

    db.query('UPDATE users SET username = ? WHERE id = ?', [username, userId], err => {
            if (err) {
                console.error('Error updating username:', err);
                return res.status(500).send(err);
            }

            db.query('UPDATE employee_profile SET fname = ?, lname = ?, email = ? WHERE user_id = ?', [fname, lname, email, userId], err => {
                    if (err) {
                        console.error('Error updating profile:', err);
                        return res.status(500).send(err);
                    }
                }
            );

            db.query('UPDATE contact_no SET cell_no = ? WHERE user_id = ?', [cell_no, userId], err => {
                    if (err) {
                        console.error('Error updating profile:', err);
                        return res.status(500).send(err);
                    }
                    res.status(200).send('Profile updated successfully');
                }
            );
        }
    );
});

// Delete user and profile
app.delete('/delete/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], err => {
        if (err) return res.status(500).send(err);
        res.status(200).send('User deleted successfully');
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
