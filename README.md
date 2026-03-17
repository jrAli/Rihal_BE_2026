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
2. [Environment Variables](#environment-variables)
3. [Database Migrations](#database-migrations)
4. [Seeding](#seeding)
5. [Running the Server](#running-the-server)
6. [API Usage](#api-usage)
7. [File Storage](#file-storage)
8. [Notes](#notes)

---

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/jrAli/Rihal_BE_2026.git
cd Rihal_BE_2026
npm install
```

## Environment Variables

Create a `.env` file using `.env.example` as a template
note. .env sent via email

```.env 
DATABASE_URL=
JWT_SECRET=
PORT=
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

Server runs at `http://localhost:[PORT]`


## API Usage

Postman collection provided: 
- import 
- ...
- ... (TODO LATER) 

Public Endpoints
  `Get /api/branches` -> List all branches

Authentication
  ...

Customer (Authenticated)
  ...

Staff / Manager / Admin
  ...

Manager / Admin

## File Storage
- Customer ID Image (required at registeration, admin retrieval only)
- Appointment Attachment (optional, restricted access)
- Validate file type and size

## Notes
- Default admin user created on first run, check email for admin/staff login creditials 
- ...
- ...
