const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.',
            message: 'Authentication required' 
        });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired',
                message: 'Please login again' 
            });
        }
        return res.status(403).json({ 
            error: 'Invalid token',
            message: 'Authentication failed' 
        });
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: 'You do not have permission to access this resource' 
            });
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };
