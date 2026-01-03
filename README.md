# SiskamLinked Patrol Service

Microservice untuk sistem manajemen patroli keamanan. Service ini menangani manajemen petugas keamanan, absensi, dan penjadwalan patroli.

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Service](#menjalankan-service)
- [API Documentation](#api-documentation)
- [Swagger UI](#swagger-ui)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)

## Fitur

- **Authentication** - Register, Login dengan JWT Token
- **Officer Management** - CRUD data petugas keamanan
- **Attendance System** - Check-in/Check-out petugas
- **Schedule Management** - Penjadwalan shift patroli
- **Health Check** - Endpoint monitoring service
- **Swagger UI** - Interactive API documentation
- **Schedule Management** - Penjadwalan shift patroli
- **Health Check** - Endpoint monitoring service

## Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| Node.js | 20.x | JavaScript Runtime |
| Express.js | 5.x | Web Framework |
| SQLite3 | 5.x | Database |
| JWT | 9.x | Authentication |
| bcryptjs | 3.x | Password Hashing |
| Docker | - | Containerization |

## Instalasi

### Prerequisites

- Node.js >= 18.x
- npm atau yarn
- Docker (opsional, untuk deployment)

### Clone Repository

```bash
git clone https://github.com/NazwanSM/siskamlinked-patrol-service.git
cd siskamlinked-patrol-service
```

### Install Dependencies

```bash
npm install
```

## Konfigurasi

Buat file `.env` di root directory:

```env
# Server
PORT=3020

# JWT Configuration
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=24h

# Database
DB_PATH=./patrol.db
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port server | `3020` |
| `JWT_SECRET` | Secret key untuk JWT | - |
| `JWT_EXPIRES_IN` | Masa berlaku token | `24h` |
| `DB_PATH` | Path file database SQLite | `./patrol.db` |

## Menjalankan Service

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Service akan berjalan di `http://localhost:3020`

## Swagger UI

Swagger UI tersedia untuk dokumentasi API interaktif.

### Akses Swagger UI

Setelah service berjalan, buka browser dan akses:

```
http://localhost:3020/api-docs
```

### Swagger JSON

Untuk mendapatkan spesifikasi OpenAPI dalam format JSON:

```
http://localhost:3020/api-docs.json
```

### Fitur Swagger UI

- **Try it out** - Test API langsung dari browser
- **Authentication** - Masukkan JWT token untuk test endpoint yang memerlukan autentikasi
- **Request/Response Examples** - Contoh request body dan response
- **Schema Definitions** - Definisi struktur data

### Cara Menggunakan

1. Buka `/api-docs` di browser
2. Untuk endpoint yang memerlukan autentikasi:
   - Login terlebih dahulu via `/auth/login`
   - Copy token dari response
   - Klik tombol "Authorize" di bagian atas
   - Masukkan token dengan format: `<token>` (tanpa kata "Bearer")
   - Klik "Authorize"
3. Sekarang bisa test semua endpoint yang memerlukan autentikasi

## API Documentation

### Base URL

```
http://localhost:3020
```

### Authentication

Semua endpoint (kecuali `/health`, `/auth/register`, `/auth/login`) membutuhkan header:

```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123",
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

#### Get Profile

```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "role": "admin"
}
```

---

### Officer Endpoints

#### Get All Officers

```http
GET /officers
```

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| `status` | Filter by status (`active`, `on_duty`) |
| `date` | Filter schedule by date (YYYY-MM-DD) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "phone_number": "081234567890",
      "emergency_contact": "082345678901",
      "position": "Security Officer",
      "status": "ON_DUTY",
      "created_at": "2026-01-03T10:00:00.000Z"
    }
  ]
}
```

#### Get Officer by ID

```http
GET /officers/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "phone_number": "081234567890",
    "emergency_contact": "082345678901",
    "position": "Security Officer",
    "status": "ON_DUTY",
    "attendance_history": [...],
    "schedules": [...]
  }
}
```

#### Create Officer

```http
POST /officers
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone_number": "081234567890",
  "emergency_contact": "082345678901",
  "position": "Security Officer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Officer created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    ...
  }
}
```

#### Update Officer

```http
PUT /officers/:id
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone_number": "081234567899",
  "position": "Senior Security Officer"
}
```

#### Delete Officer

```http
DELETE /officers/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Officer deleted successfully"
}
```

---

### Attendance Endpoints

#### Record Attendance (Check-in/Check-out)

```http
POST /officers/:id/attendance
```

**Request Body:**
```json
{
  "type": "check_in",
  "location": "Gate A",
  "notes": "Starting morning shift"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `check_in` atau `check_out` |
| `location` | string | No | Lokasi check-in |
| `notes` | string | No | Catatan tambahan |

#### Get Attendance History

```http
GET /officers/:id/attendance
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "officer_id": 1,
      "check_in_time": "2026-01-03T06:00:00.000Z",
      "check_out_time": "2026-01-03T14:00:00.000Z",
      "location": "Gate A",
      "notes": "Morning shift completed"
    }
  ]
}
```

---

### Schedule Endpoints

#### Get Officer Schedules

```http
GET /officers/:id/schedules
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "officer_id": 1,
      "date": "2026-01-03",
      "shift": "morning",
      "location": "Building A",
      "notes": "Regular patrol"
    }
  ]
}
```

#### Create Schedule

```http
POST /officers/:id/schedules
```

**Request Body:**
```json
{
  "date": "2026-01-03",
  "shift": "morning",
  "location": "Building A",
  "notes": "Regular patrol"
}
```

| Shift | Time |
|-------|------|
| `morning` | 06:00 - 14:00 |
| `afternoon` | 14:00 - 22:00 |
| `night` | 22:00 - 06:00 |

---

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Patrol Service is running"
}
```

---

## Testing

### Menggunakan cURL

```bash
# Health Check
curl http://localhost:3020/health

# Register
curl -X POST http://localhost:3020/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Login
curl -X POST http://localhost:3020/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get Officers (dengan token)
curl http://localhost:3020/officers \
  -H "Authorization: Bearer <your-token>"
```

## Docker Deployment

### Build dan Run dengan Docker Compose

```bash
# Build image
docker compose build

# Run container
docker compose up -d

# Lihat logs
docker logs -f patrol-service

# Stop container
docker compose down
```

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY src ./src

EXPOSE 3020

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
services:
  patrol-service:
    build: .
    container_name: patrol-service
    env_file:
      - .env
    ports:
      - "3020:3020"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

---

## Struktur Project

```
siskamlinked-patrol-service/
├── src/
│   ├── app.js                 # Express app setup
│   ├── config/
│   │   ├── database.js        # SQLite connection
│   │   └── jwt.config.js      # JWT configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Auth logic
│   │   └── officer.controller.js # Officer logic
│   ├── middleware/
│   │   └── auth.middleware.js # JWT verification
│   ├── models/
│   │   ├── user.model.js      # User model
│   │   └── officer.model.js   # Officer model
│   └── routes/
│       ├── auth.routes.js     # Auth routes
│       └── officer.routes.js  # Officer routes
├── server.js                  # Entry point
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
├── .dockerignore
├── .gitignore
├── test-frontend.html         # API Tester UI
└── README.md
```

---

## Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict |
| `500` | Internal Server Error |

---