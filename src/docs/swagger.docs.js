/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health Check
 *     description: Endpoint untuk mengecek status service
 *     responses:
 *       200:
 *         description: Service berjalan dengan baik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Patrol Service is running
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register User Baru
 *     description: Mendaftarkan user baru ke sistem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: admin
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: admin123
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *                 example: admin
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Username sudah digunakan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login User
 *     description: Login untuk mendapatkan JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Kredensial tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get User Profile
 *     description: Mendapatkan profil user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token tidak valid atau tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /officers:
 *   get:
 *     tags:
 *       - Officers
 *     summary: Get All Officers
 *     description: Mendapatkan daftar semua petugas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, on_duty]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter jadwal berdasarkan tanggal (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daftar petugas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Officer'
 *                 count:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Officers
 *     summary: Create Officer
 *     description: Menambahkan petugas baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfficerInput'
 *     responses:
 *       201:
 *         description: Petugas berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Officer created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /officers/{id}:
 *   get:
 *     tags:
 *       - Officers
 *     summary: Get Officer by ID
 *     description: Mendapatkan detail petugas berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     responses:
 *       200:
 *         description: Detail petugas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Officer'
 *                     - type: object
 *                       properties:
 *                         attendance_history:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Attendance'
 *                         schedules:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags:
 *       - Officers
 *     summary: Update Officer
 *     description: Mengupdate data petugas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfficerInput'
 *     responses:
 *       200:
 *         description: Petugas berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Officer updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Officers
 *     summary: Delete Officer
 *     description: Menghapus data petugas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     responses:
 *       200:
 *         description: Petugas berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Officer deleted successfully
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /officers/{id}/attendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get Attendance History
 *     description: Mendapatkan riwayat absensi petugas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     responses:
 *       200:
 *         description: Riwayat absensi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendance'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Record Attendance
 *     description: Mencatat absensi (check-in atau check-out)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceInput'
 *     responses:
 *       200:
 *         description: Absensi berhasil dicatat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Check-in successful
 *                 data:
 *                   $ref: '#/components/schemas/Officer'
 *       400:
 *         description: Validasi gagal atau tidak ada check-in aktif
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /officers/{id}/schedules:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Get Officer Schedules
 *     description: Mendapatkan jadwal patroli petugas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     responses:
 *       200:
 *         description: Jadwal patroli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Schedule
 *     summary: Create Schedule
 *     description: Membuat jadwal patroli baru
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Officer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       201:
 *         description: Jadwal berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Schedule created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Petugas tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
