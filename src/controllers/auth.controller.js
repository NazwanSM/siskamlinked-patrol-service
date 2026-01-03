const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const jwtConfig = require('../config/jwt.config');

exports.register = (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username and password are required' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            error: 'Password must be at least 6 characters' 
        });
    }

    User.findByUsername(username, (err, existingUser) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (existingUser) {
            return res.status(409).json({ 
                error: 'Username already exists' 
            });
        }

        const userRole = role || 'user'; // Default role: user
        User.create(username, password, userRole, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: this.lastID,
                    username: username,
                    role: userRole
                }
            });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            error: 'Username and password are required' 
        });
    }

    User.findByUsername(username, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Username or password is incorrect'
            });
        }

        const isPasswordValid = User.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                message: 'Username or password is incorrect'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                role: user.role 
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
};

exports.getProfile = (req, res) => {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: user
        });
    });
};
