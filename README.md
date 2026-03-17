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
git clone <YOUR_REPO_URL>
cd flowcare-backend
npm install