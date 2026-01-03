const db = require('../config/database');

class Officer {
    
    static getAll(callback) {
        const sql = "SELECT * FROM officers ORDER BY created_at DESC";
        db.all(sql, [], callback);
    }

    static getById(id, callback) {
        const sql = "SELECT * FROM officers WHERE id = ?";
        db.get(sql, [id], callback);
    }

    static getActive(callback) {
        const sql = "SELECT * FROM officers WHERE status = 'ON_DUTY'";
        db.all(sql, [], callback);
    }

    static create(officer, callback) {
        const sql = `INSERT INTO officers (name, phone_number, emergency_contact, position, status) 
                    VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [
            officer.name,
            officer.phone_number,
            officer.emergency_contact,
            officer.position || 'Officer',
            officer.status || 'OFF_DUTY'
        ], callback);
    }

    static update(id, officer, callback) {
        const sql = `UPDATE officers 
                    SET name = ?, phone_number = ?, emergency_contact = ?, position = ?, last_updated = CURRENT_TIMESTAMP 
                    WHERE id = ?`;
        db.run(sql, [
            officer.name,
            officer.phone_number,
            officer.emergency_contact,
            officer.position,
            id
        ], callback);
    }

    static delete(id, callback) {
        const sql = "DELETE FROM officers WHERE id = ?";
        db.run(sql, [id], callback);
    }

    
    static checkIn(officerId, location, notes, callback) {
        db.serialize(() => {
            const logSql = `INSERT INTO attendance_logs (officer_id, check_in_time, location, notes) 
                            VALUES (?, CURRENT_TIMESTAMP, ?, ?)`;
            
            db.run(logSql, [officerId, location, notes], function(err) {
                if (err) return callback(err);
                
                const logId = this.lastID;
                
                const updateSql = `UPDATE officers 
                                SET status = 'ON_DUTY', last_updated = CURRENT_TIMESTAMP 
                                WHERE id = ?`;
                
                db.run(updateSql, [officerId], function(err) {
                    if (err) return callback(err);
                    callback(null, { logId, changes: this.changes });
                });
            });
        });
    }

    static checkOut(officerId, notes, callback) {
        db.serialize(() => {
            const findSql = `SELECT id FROM attendance_logs 
                            WHERE officer_id = ? AND check_out_time IS NULL 
                            ORDER BY check_in_time DESC LIMIT 1`;
            
            db.get(findSql, [officerId], (err, log) => {
                if (err) return callback(err);
                if (!log) return callback(new Error('No active check-in found'));
                
                const updateLogSql = `UPDATE attendance_logs 
                                    SET check_out_time = CURRENT_TIMESTAMP, notes = COALESCE(notes || ' | ' || ?, notes, ?) 
                                    WHERE id = ?`;
                
                db.run(updateLogSql, [notes, notes, log.id], function(err) {
                    if (err) return callback(err);

                    const updateOfficerSql = `UPDATE officers 
                                            SET status = 'OFF_DUTY', last_updated = CURRENT_TIMESTAMP 
                                            WHERE id = ?`;
                    
                    db.run(updateOfficerSql, [officerId], function(err) {
                        if (err) return callback(err);
                        callback(null, { changes: this.changes });
                    });
                });
            });
        });
    }

    static getAttendanceHistory(officerId, limit, callback) {
        const sql = `SELECT * FROM attendance_logs 
                    WHERE officer_id = ? 
                    ORDER BY check_in_time DESC 
                    LIMIT ?`;
        db.all(sql, [officerId, limit || 10], callback);
    }

    static createSchedule(schedule, callback) {
        const sql = `INSERT INTO patrol_schedules (officer_id, shift_date, shift_start, shift_end, location, notes) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [
            schedule.officer_id,
            schedule.shift_date,
            schedule.shift_start,
            schedule.shift_end,
            schedule.location,
            schedule.notes
        ], callback);
    }

    static getScheduleByOfficer(officerId, startDate, endDate, callback) {
        const sql = `SELECT ps.*, o.name as officer_name, o.phone_number 
                    FROM patrol_schedules ps 
                    JOIN officers o ON ps.officer_id = o.id 
                    WHERE ps.officer_id = ? AND ps.shift_date BETWEEN ? AND ? 
                    ORDER BY ps.shift_date DESC, ps.shift_start`;
        db.all(sql, [officerId, startDate, endDate], callback);
    }

    static getScheduleByDate(date, callback) {
        const sql = `SELECT ps.*, o.name as officer_name, o.phone_number, o.status 
                    FROM patrol_schedules ps 
                    JOIN officers o ON ps.officer_id = o.id 
                    WHERE ps.shift_date = ? 
                    ORDER BY ps.shift_start`;
        db.all(sql, [date], callback);
    }

    static getOfficerWithDetails(officerId, callback) {
        this.getById(officerId, (err, officer) => {
            if (err) return callback(err);
            if (!officer) return callback(new Error('Officer not found'));
            
            const today = new Date().toISOString().split('T')[0];
            
            const scheduleSql = `SELECT * FROM patrol_schedules 
                                WHERE officer_id = ? AND shift_date >= ? 
                                ORDER BY shift_date, shift_start LIMIT 5`;
            
            db.all(scheduleSql, [officerId, today], (err, schedules) => {
                if (err) return callback(err);
                
                this.getAttendanceHistory(officerId, 5, (err, attendance) => {
                    if (err) return callback(err);
                    
                    officer.upcoming_schedules = schedules;
                    officer.attendance_history = attendance;
                    callback(null, officer);
                });
            });
        });
    }
}

module.exports = Officer;
