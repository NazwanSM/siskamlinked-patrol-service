const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officer.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All officer routes require authentication
router.use(verifyToken);

// === OFFICER CRUD ===
router.get('/', officerController.getOfficers);
router.get('/:id', officerController.getOfficerById);
router.post('/', officerController.createOfficer);
router.put('/:id', officerController.updateOfficer);
router.delete('/:id', officerController.deleteOfficer);

// === ATTENDANCE ===
router.post('/:id/attendance', officerController.manageAttendance);
router.get('/:id/attendance', officerController.getAttendanceHistory);

// === SCHEDULE ===
router.get('/:id/schedules', officerController.getSchedules);
router.post('/:id/schedules', officerController.createSchedule);

module.exports = router;
