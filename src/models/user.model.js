const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static create(username, password, role, callback) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        
        db.run(sql, [username, hashedPassword, role], callback);
    }

    static findByUsername(username, callback) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], callback);
    }

    static findById(id, callback) {
        const sql = 'SELECT id, username, role, created_at FROM users WHERE id = ?';
        db.get(sql, [id], callback);
    }

    static comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    static getAll(callback) {
        const sql = 'SELECT id, username, role, created_at FROM users';
        db.all(sql, [], callback);
    }
}

module.exports = User;
