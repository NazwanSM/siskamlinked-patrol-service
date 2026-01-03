const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../../patrol.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user', -- Roles: admin, user, officer
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
            } else {
                // Insert default admin user (password: admin123)
                db.get("SELECT count(*) as count FROM users", (err, row) => {
                    if (row && row.count === 0) {
                        const bcrypt = require('bcryptjs');
                        const hashedPassword = bcrypt.hashSync('admin123', 10);
                        const insert = 'INSERT INTO users (username, password, role) VALUES (?,?,?)';
                        db.run(insert, ["admin", hashedPassword, "admin"]);
                        db.run(insert, ["user", bcrypt.hashSync('user123', 10), "user"]);
                        console.log('Default users created (admin/admin123, user/user123)');
                    }
                });
            }
        });

        // Membuat tabel petugas (officers)
        db.run(`CREATE TABLE IF NOT EXISTS officers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            emergency_contact TEXT NOT NULL,
            position TEXT DEFAULT 'Officer',
            status TEXT DEFAULT 'OFF_DUTY', -- Status: ON_DUTY / OFF_DUTY
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
            } else {
                db.get("SELECT count(*) as count FROM officers", (err, row) => {
                    if (row && row.count === 0) {
                        const insert = 'INSERT INTO officers (name, phone_number, emergency_contact, position, status) VALUES (?,?,?,?,?)';
                        
                        // Data dummy officers
                        db.run(insert, ["Budi Santoso", "08123456789", "08111222333", "Security Officer", "ON_DUTY"]);
                        db.run(insert, ["Asep Kurniawan", "08198765432", "08222333444", "Patrol Officer", "ON_DUTY"]);
                        db.run(insert, ["Siti Aminah", "08134567890", "08333444555", "Patrol Officer", "OFF_DUTY"]);
                        db.run(insert, ["Joko Kerung", "08145678901", "08444555666", "Security Officer", "OFF_DUTY"]);
                        db.run(insert, ["Rina Susanti", "08156789012", "08555666777", "Patrol Officer", "ON_DUTY"]);
                        db.run(insert, ["Ahmad Fauzi", "08167890123", "08666777888", "Security Officer", "OFF_DUTY"]);
                        db.run(insert, ["Dewi Lestari", "08178901234", "08777888999", "Patrol Officer", "OFF_DUTY"]);
                        db.run(insert, ["Hendra Wijaya", "08189012345", "08888999000", "Security Officer", "ON_DUTY"]);
                        db.run(insert, ["Sri Mulyanto", "08190123456", "08999000111", "Patrol Officer", "OFF_DUTY"]);
                        db.run(insert, ["Bambang Permadi", "08101234567", "08000111222", "Security Officer", "ON_DUTY"]);
                        
                        console.log('✅ 10 dummy officers berhasil ditambahkan.');
                        
                        setTimeout(() => {
                            const scheduleInsert = 'INSERT INTO patrol_schedules (officer_id, shift_date, shift_start, shift_end, location, notes) VALUES (?,?,?,?,?,?)';

                            const today = new Date().toISOString().split('T')[0];
                            const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                            const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
                            
                            db.run(scheduleInsert, [1, today, "07:00", "15:00", "Gerbang Utama", "Shift pagi - pintu masuk"]);
                            db.run(scheduleInsert, [3, today, "07:00", "15:00", "Area Parkir", "Shift pagi - monitoring parkir"]);
                            db.run(scheduleInsert, [5, today, "07:00", "15:00", "Gedung A", "Shift pagi - patroli gedung"]);

                            db.run(scheduleInsert, [2, today, "15:00", "23:00", "Gerbang Belakang", "Shift siang - area belakang"]);
                            db.run(scheduleInsert, [4, today, "15:00", "23:00", "Taman & Keliling", "Shift siang - patroli area outdoor"]);
                            db.run(scheduleInsert, [8, today, "15:00", "23:00", "Gedung B", "Shift siang - monitoring gedung"]);
                            
                            // Shift malam (23:00 - 07:00)
                            db.run(scheduleInsert, [6, today, "23:00", "07:00", "Gerbang Utama", "Shift malam - jaga malam"]);
                            db.run(scheduleInsert, [10, today, "23:00", "07:00", "Area Keliling", "Shift malam - patroli keliling"]);
                            
                            // Jadwal besok
                            db.run(scheduleInsert, [7, tomorrow, "07:00", "15:00", "Gerbang Utama", "Shift pagi"]);
                            db.run(scheduleInsert, [9, tomorrow, "07:00", "15:00", "Area Parkir", "Shift pagi"]);
                            db.run(scheduleInsert, [1, tomorrow, "15:00", "23:00", "Gedung A", "Shift siang"]);
                            db.run(scheduleInsert, [3, tomorrow, "15:00", "23:00", "Gedung B", "Shift siang"]);
                            db.run(scheduleInsert, [5, tomorrow, "23:00", "07:00", "Gerbang Belakang", "Shift malam"]);
                            
                            // Jadwal minggu depan
                            db.run(scheduleInsert, [2, nextWeek, "07:00", "15:00", "Gerbang Utama", "Shift pagi minggu depan"]);
                            db.run(scheduleInsert, [4, nextWeek, "15:00", "23:00", "Area Keliling", "Shift siang minggu depan"]);
                            db.run(scheduleInsert, [6, nextWeek, "23:00", "07:00", "Gerbang Utama", "Shift malam minggu depan"]);
                            
                            console.log('✅ 16 dummy patrol schedules berhasil ditambahkan.');
                        }, 100);
                        
                        setTimeout(() => {
                            const attendanceInsert = 'INSERT INTO attendance_logs (officer_id, check_in_time, check_out_time, location, notes) VALUES (?,?,?,?,?)';
                            
                            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                            db.run(attendanceInsert, [1, `${yesterday} 07:05:00`, `${yesterday} 15:10:00`, "Gerbang Utama", "Shift selesai tepat waktu"]);
                            db.run(attendanceInsert, [2, `${yesterday} 15:02:00`, `${yesterday} 23:05:00`, "Gerbang Belakang", "Shift selesai"]);
                            db.run(attendanceInsert, [3, `${yesterday} 07:00:00`, `${yesterday} 15:15:00`, "Area Parkir", "Patroli berjalan lancar"]);
                            db.run(attendanceInsert, [4, `${yesterday} 15:10:00`, `${yesterday} 23:00:00`, "Keliling", "Tidak ada insiden"]);
                            db.run(attendanceInsert, [5, `${yesterday} 07:03:00`, `${yesterday} 15:05:00`, "Gedung A", "Shift normal"]);
                            
                            const now = new Date();
                            const hours = String(now.getHours()).padStart(2, '0');
                            const minutes = String(now.getMinutes()).padStart(2, '0');
                            const currentTime = `${hours}:${minutes}:00`;
                            const today = now.toISOString().split('T')[0];
                            
                            db.run(attendanceInsert, [1, `${today} 07:00:00`, null, "Gerbang Utama", "Sedang bertugas"]);
                            db.run(attendanceInsert, [2, `${today} 15:05:00`, null, "Gerbang Belakang", "Sedang patroli"]);
                            db.run(attendanceInsert, [5, `${today} 07:02:00`, null, "Gedung A", "On duty"]);
                            db.run(attendanceInsert, [8, `${today} 15:00:00`, null, "Gedung B", "Monitoring CCTV"]);
                            db.run(attendanceInsert, [10, `${today} 23:00:00`, null, "Area Keliling", "Shift malam"]);
                            
                            console.log('✅ 10 dummy attendance logs berhasil ditambahkan.');
                        }, 200);
                    }
                });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS patrol_schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            officer_id INTEGER NOT NULL,
            shift_date DATE NOT NULL,
            shift_start TIME NOT NULL,
            shift_end TIME NOT NULL,
            location TEXT NOT NULL,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creating patrol_schedules table:', err.message);
            } else {
                console.log('Table patrol_schedules ready.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS attendance_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            officer_id INTEGER NOT NULL,
            check_in_time DATETIME NOT NULL,
            check_out_time DATETIME,
            location TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (officer_id) REFERENCES officers(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Error creating attendance_logs table:', err.message);
            } else {
                console.log('Table attendance_logs ready.');
            }
        });
    }
});

module.exports = db;
