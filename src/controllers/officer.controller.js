const Officer = require('../models/officer.model');

exports.getOfficers = (req, res) => {
    const { status, date } = req.query;
    
    if (status === 'active' || status === 'on_duty') {
        Officer.getActive((err, rows) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            res.json({
                success: true,
                data: rows,
                count: rows.length
            });
        });
    }
    else if (date) {
        Officer.getScheduleByDate(date, (err, schedules) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            res.json({
                success: true,
                data: schedules,
                count: schedules.length
            });
        });
    }
    else {
        Officer.getAll((err, rows) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            res.json({
                success: true,
                data: rows
            });
        });
    }
};

exports.getOfficerById = (req, res) => {
    const { id } = req.params;
    
    Officer.getOfficerWithDetails(id, (err, officer) => {
        if (err) {
            if (err.message === 'Officer not found') {
                return res.status(404).json({ 
                    success: false,
                    error: 'Officer not found' 
                });
            }
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        res.json({
            success: true,
            data: officer
        });
    });
};

exports.createOfficer = (req, res) => {
    const { name, phone_number, emergency_contact, position } = req.body;
    
    if (!name || !phone_number || !emergency_contact) {
        return res.status(400).json({ 
            success: false,
            error: 'Name, phone_number, and emergency_contact are required' 
        });
    }
    
    Officer.create(req.body, function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        Officer.getById(this.lastID, (err, officer) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            res.status(201).json({
                success: true,
                message: 'Officer created successfully',
                data: officer
            });
        });
    });
};

exports.updateOfficer = (req, res) => {
    const { id } = req.params;
    
    Officer.update(id, req.body, function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Officer not found' 
            });
        }
        
        Officer.getById(id, (err, officer) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            res.json({
                success: true,
                message: 'Officer updated successfully',
                data: officer
            });
        });
    });
};

exports.deleteOfficer = (req, res) => {
    const { id } = req.params;
    
    Officer.delete(id, function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Officer not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Officer deleted successfully'
        });
    });
};

exports.manageAttendance = (req, res) => {
    const { id } = req.params;
    const { action, location, notes } = req.body;
    
    if (!action || !['check-in', 'check-out'].includes(action)) {
        return res.status(400).json({ 
            success: false,
            error: 'action is required and must be "check-in" or "check-out"' 
        });
    }
    
    if (action === 'check-in') {
        Officer.getById(id, (err, officer) => {
            if (err) {
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            
            if (!officer) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Officer not found' 
                });
            }
            
            if (officer.status === 'ON_DUTY') {
                return res.status(400).json({ 
                    success: false,
                    error: 'Officer is already on duty' 
                });
            }
            
            Officer.checkIn(id, location, notes, (err, result) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false,
                        error: err.message 
                    });
                }
                
                Officer.getById(id, (err, updatedOfficer) => {
                    if (err) {
                        return res.status(500).json({ 
                            success: false,
                            error: err.message 
                        });
                    }
                    
                    res.json({
                        success: true,
                        message: 'Check-in successful. Status updated to ON DUTY',
                        data: {
                            log_id: result.logId,
                            officer: updatedOfficer
                        }
                    });
                });
            });
        });
    }
    else {
        Officer.checkOut(id, notes, (err, result) => {
            if (err) {
                if (err.message === 'No active check-in found') {
                    return res.status(400).json({ 
                        success: false,
                        error: 'No active check-in found for this officer' 
                    });
                }
                return res.status(500).json({ 
                    success: false,
                    error: err.message 
                });
            }
            
            Officer.getById(id, (err, updatedOfficer) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false,
                        error: err.message 
                    });
                }
                
                res.json({
                    success: true,
                    message: 'Check-out successful. Status updated to OFF DUTY',
                    data: {
                        officer: updatedOfficer
                    }
                });
            });
        });
    }
};

exports.getAttendanceHistory = (req, res) => {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    Officer.getAttendanceHistory(id, limit, (err, history) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        res.json({
            success: true,
            data: history
        });
    });
};

exports.getSchedules = (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    const startDate = start_date || new Date().toISOString().split('T')[0];
    const endDate = end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    Officer.getScheduleByOfficer(id, startDate, endDate, (err, schedules) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        res.json({
            success: true,
            data: schedules
        });
    });
};

exports.createSchedule = (req, res) => {
    const { id } = req.params;
    const { shift_date, shift_start, shift_end, location, notes } = req.body;
    
    if (!shift_date || !shift_start || !shift_end || !location) {
        return res.status(400).json({ 
            success: false,
            error: 'shift_date, shift_start, shift_end, and location are required' 
        });
    }
    
    const scheduleData = {
        officer_id: id,
        ...req.body
    };
    
    Officer.createSchedule(scheduleData, function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: err.message 
            });
        }
        
        res.status(201).json({
            success: true,
            message: 'Schedule created successfully',
            data: { id: this.lastID }
        });
    });
};
