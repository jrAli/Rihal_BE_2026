# FlowCare Queue & Appointment Booking System (Backend)

## Overview
FlowCare is a role-based queue and appointment booking system for service branches across Oman.  

This backend API handles:

- Booking, rescheduling, and cancelling appointments
- Branch-based access control
- Staff roles and permissions
- Authentication & authorization
- Seed data import
- Audit logging for sensitive actions

---

## Table of Contents
1. [Setup](#setup)
2. [Prerequisites](#Prerequisites)
3. [Environment Variables](#environment-variables)
4. [Database Migrations](#database-migrations)
5. [Seeding](#seeding)
6. [Running the Server](#running-the-server)
7. [API Usage](#api-usage)
8. [File Storage](#file-storage)
9. [Notes](#notes)

---

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or later recommended)
- Optional: Postman (for testing API endpoints)
- Optional: Git (for cloning the repository)

Tech stack used:

- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **File uploads:** Multer

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/jrAli/Rihal_BE_2026.git
cd Rihal_BE_2026
npm install
```

## Environment Variables

Create a `.env` file using `.env.example` as a template
note. `.env` sent via email

```.env 
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Database Migrations

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Verify connection:

```
npx prisma db pull
```

## Seeding
Run this command to populate database 

```bash
node prisma/seed.js
```

seeding rules:
- Idempotent
- includes branches, service type, staff, managers, and slots
- optional AppointmentAttachment

## Running the Server


```bash
npm run dev
```

Server runs at `http://localhost:3000` or `http://localhost:3001`


## API Usage

A Postman collection is provided — import `FlowCare.postman_collection.json` from the root of the repository.

### Authentication Flow
1. Login via `POST /api/auth/login`
2. Copy the token from the response
3. In Postman, go to Authorization → select **Bearer Token** → paste the token
4. All protected endpoints will now be authenticated

---

### Public Endpoints (No authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/branches` | List all branches |
| GET | `/api/branches/:id/services` | List services by branch |
| GET | `/api/slots?branchID=&serviceTypeId=&date=` | List available slots |

---

### Auth

| Method | Endpoint | Description | Body (form-data) |
|--------|----------|-------------|-----------------|
| POST | `/api/auth/register` | Register customer | `name, email, username, password, phone, id_image (file)` |
| POST | `/api/auth/login` | Login any user, returns JWT | `username, password` |

---

### Customer (Authenticated)

| Method | Endpoint | Description | Body (form-data) |
|--------|----------|-------------|-----------------|
| GET | `/api/appointments` | List my appointments | — |
| GET | `/api/appointments/:appt_id` | Get appointment details | — |
| POST | `/api/appointments` | Book appointment | `slotID, attachments (optional file)` |
| DELETE | `/api/appointments/:appt_id` | Cancel appointment | — |
| PATCH | `/api/appointments/:appt_id/reschedule` | Reschedule appointment | `newSlotID` |

---

### Staff / Manager / Admin (Authenticated)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/appointments` | List appointments (scoped by role) | — |
| PATCH | `/api/appointments/:appt_id/status` | Update appointment status | `newStatus` |
| GET | `/api/manage/audit-logs` | View audit logs (branch scoped) | — |

---

### Manager / Admin (Authenticated)

| Method | Endpoint | Description | Body (JSON) |
|--------|----------|-------------|------------|
| GET | `/api/manage/staff` | List staff (scoped by role) | — |
| GET | `/api/manage/customers` | List customers | — |
| GET | `/api/manage/customers/:customerID` | Get customer details | — |
| POST | `/api/slots` | Create slot (single or bulk) | `branchID, serviceIDType, startTime, endTime, capacity, staffID (optional)` |
| PATCH | `/api/slots/:slotID` | Update slot | any slot fields |
| DELETE | `/api/slots/:slotID` | Soft delete slot | — |
| POST | `/api/manage/staff/assign` | Assign staff to service/branch | `staffID, serviceID, branchID (admin only)` |

---

### Admin Only

| Method | Endpoint | Description | Body (JSON) |
|--------|----------|-------------|------------|
| PATCH | `/api/manage/config/retention` | Set soft-delete retention period | `days` |
| DELETE | `/api/manage/slots/cleanup` | Hard delete expired slots | — |
| GET | `/api/manage/audit-logs` | View all audit logs | — |
| GET | `/api/manage/audit-logs/export` | Export audit logs as CSV | — |

---

### File Retrieval

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/manage/customers/:customerID/id-image` | Get customer ID image | Admin only |
| GET | `/api/manage/appointments/:appointmentID/attachment` | Get appointment attachment | Staff, Manager, Admin, or appointment owner |

## Postman Collection

Import `FlowCare.postman_collection.json` from the root of the repository.

Most endpoints use **form-data** in Postman. The only exception:

- `POST /api/slots` — use **raw → JSON** for bulk slot creation:
```json
[
  {
    "branchID": "br_muscat_001",
    "serviceIDType": "svc_mus_001",
    "startTime": "2026-03-20T08:00:00.000Z",
    "endTime": "2026-03-20T09:00:00.000Z",
    "capacity": 1
  }
]
```

## Notes
- Default admin user is created on first run. Credentials provided in the submission email.
- JWT tokens in the Postman collection are expired — login first to get a fresh token, then update the Bearer Token in each request.
- Postman collection is included in the root of the repository: `FlowCare.postman_collection.json`. Import it into Postman to test all endpoints.