const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SiskamLinked Patrol Service API',
            version: '1.0.0',
            description: 'API Documentation untuk Microservice Patrol Management System. Service ini menangani manajemen petugas keamanan, absensi, dan penjadwalan patroli.',
        },
        servers: [
            {
                url: 'http://localhost:3020',
                description: 'Development Server'
            },
            {
                url: 'http://18223066.tesatepadang.space',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Masukkan JWT token yang didapat dari endpoint /auth/login'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'User ID',
                            example: 1
                        },
                        username: {
                            type: 'string',
                            description: 'Username',
                            example: 'admin'
                        },
                        role: {
                            type: 'string',
                            description: 'User role',
                            enum: ['admin', 'user'],
                            example: 'admin'
                        }
                    }
                },
                Officer: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Officer ID',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'Nama lengkap petugas',
                            example: 'John Doe'
                        },
                        phone_number: {
                            type: 'string',
                            description: 'Nomor telepon',
                            example: '081234567890'
                        },
                        emergency_contact: {
                            type: 'string',
                            description: 'Kontak darurat',
                            example: '082345678901'
                        },
                        position: {
                            type: 'string',
                            description: 'Jabatan/posisi',
                            example: 'Security Officer'
                        },
                        status: {
                            type: 'string',
                            description: 'Status tugas',
                            enum: ['ON_DUTY', 'OFF_DUTY'],
                            example: 'OFF_DUTY'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Tanggal dibuat'
                        },
                        last_updated: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Tanggal terakhir diupdate'
                        }
                    }
                },
                OfficerInput: {
                    type: 'object',
                    required: ['name', 'phone_number', 'emergency_contact'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Nama lengkap petugas',
                            example: 'John Doe'
                        },
                        phone_number: {
                            type: 'string',
                            description: 'Nomor telepon',
                            example: '081234567890'
                        },
                        emergency_contact: {
                            type: 'string',
                            description: 'Kontak darurat',
                            example: '082345678901'
                        },
                        position: {
                            type: 'string',
                            description: 'Jabatan/posisi',
                            example: 'Security Officer'
                        }
                    }
                },
                Attendance: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Attendance ID',
                            example: 1
                        },
                        officer_id: {
                            type: 'integer',
                            description: 'Officer ID',
                            example: 1
                        },
                        check_in_time: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Waktu check-in'
                        },
                        check_out_time: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Waktu check-out'
                        },
                        location: {
                            type: 'string',
                            description: 'Lokasi',
                            example: 'Gate A'
                        },
                        notes: {
                            type: 'string',
                            description: 'Catatan',
                            example: 'Morning shift'
                        }
                    }
                },
                AttendanceInput: {
                    type: 'object',
                    required: ['type'],
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['check_in', 'check_out'],
                            description: 'Tipe absensi',
                            example: 'check_in'
                        },
                        location: {
                            type: 'string',
                            description: 'Lokasi check-in',
                            example: 'Gate A'
                        },
                        notes: {
                            type: 'string',
                            description: 'Catatan tambahan',
                            example: 'Starting morning shift'
                        }
                    }
                },
                Schedule: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Schedule ID',
                            example: 1
                        },
                        officer_id: {
                            type: 'integer',
                            description: 'Officer ID',
                            example: 1
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Tanggal jadwal',
                            example: '2026-01-03'
                        },
                        shift: {
                            type: 'string',
                            enum: ['morning', 'afternoon', 'night'],
                            description: 'Shift (morning: 06:00-14:00, afternoon: 14:00-22:00, night: 22:00-06:00)',
                            example: 'morning'
                        },
                        location: {
                            type: 'string',
                            description: 'Lokasi patroli',
                            example: 'Building A'
                        },
                        notes: {
                            type: 'string',
                            description: 'Catatan',
                            example: 'Regular patrol'
                        }
                    }
                },
                ScheduleInput: {
                    type: 'object',
                    required: ['date', 'shift', 'location'],
                    properties: {
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Tanggal jadwal',
                            example: '2026-01-03'
                        },
                        shift: {
                            type: 'string',
                            enum: ['morning', 'afternoon', 'night'],
                            description: 'Shift',
                            example: 'morning'
                        },
                        location: {
                            type: 'string',
                            description: 'Lokasi patroli',
                            example: 'Building A'
                        },
                        notes: {
                            type: 'string',
                            description: 'Catatan',
                            example: 'Regular patrol'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        },
                        message: {
                            type: 'string',
                            description: 'Detailed message'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoint'
            },
            {
                name: 'Authentication',
                description: 'Endpoint untuk autentikasi user'
            },
            {
                name: 'Officers',
                description: 'Endpoint untuk manajemen data petugas'
            },
            {
                name: 'Attendance',
                description: 'Endpoint untuk manajemen absensi'
            },
            {
                name: 'Schedule',
                description: 'Endpoint untuk manajemen jadwal patroli'
            }
        ]
    },
    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../docs/*.js')
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
