import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import seedData from './example.json' with {type: 'json'}; // importing seed from the example.json
import bcrypt from 'bcrypt';

// Must use adapter when initilizing prisma, according to prisma v7
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: false }) // ssl set to false when hosting localy
const prisma = new PrismaClient({ adapter })

const HASHING_SALT = 12;
const IMAGE_PLACE_HOLDER = "placeholder.jpg";

async function main(){
  // upsert function is used to ensures idempotent (no duplicated data)
  // Add seed data goes here (order matters!)
  
  // Branches
  for (const e of seedData.branches){
    await prisma.branch.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        name:             e.name,
        city:             e.city,
        address:          e.address,
        timezone:         e.timezone,
        isActive:         e.is_active
      }
    });
  }

  // ServiceTypes
  for (const e of seedData.service_types){
    await prisma.serviceType.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        branchID:         e.branch_id,
        name:             e.name,
        description:      e.description,
        isActive:         e.is_active,
        durationMin:      e.duration_minutes
      }
    });
  }
  
  // Admin (staff)
  for (const e of seedData.users.admin){
    await prisma.staff.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        username:         e.username,
        name:             e.full_name,
        email:            e.email,
        password:         await bcrypt.hash(e.password, HASHING_SALT),
        role:             e.role,
        isActive:         e.is_active
      }
    });
  }
  
  // Managers (staff)
  for (const e of seedData.users.branch_managers){
    await prisma.staff.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        username:         e.username,
        name:             e.full_name,
        email:            e.email,
        password:         await bcrypt.hash(e.password, HASHING_SALT),
        role:             e.role,
        branchID:         e.branch_id,
        isActive:         e.is_active
      }
    });
  }

  // Staff
  for (const e of seedData.users.staff){
    await prisma.staff.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id:               e.id,
        username:         e.username,
        name:             e.full_name,
        email:            e.email,
        password:         await bcrypt.hash(e.password, HASHING_SALT),
        role:             e.role,
        branchID:         e.branch_id,
        isActive:         e.is_active
      }
    });
  }

  // StaffServiceTypes
  for (const e of seedData.staff_service_types){
    await prisma.staffServiceType.upsert({
      where: {
        staffID_ServiceTypeID: {
          staffID:        e.staff_id,
          ServiceTypeID:  e.service_type_id
        }
      },
      update: {},
      create: {
        staffID:          e.staff_id,
        ServiceTypeID:    e.service_type_id
      }
    });
  }

  // Customer
  for (const e of seedData.users.customers){
    await prisma.customer.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        username:         e.username,
        name:             e.full_name,
        email:            e.email,
        password:         await bcrypt.hash(e.password, HASHING_SALT), // encrpt password
        phone:            e.phone,
        idImagePath:      IMAGE_PLACE_HOLDER,
        isActive:         e.is_active
      }
    })
  }

  // Slots
  for (const e of seedData.slots){
    await prisma.slot.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        branchID:         e.branch_id,
        serviceIDType:    e.service_type_id,
        staffID:          e.staff_id,
        startTime:        e.start_at,
        endTime:          e.end_at,
        capacity:         e.capacity,
        isAvailable:      e.is_active
      }
    });
  }

  // Appointments
  for (const e of seedData.appointments){
    await prisma.appointment.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        customerID:       e.customer_id,
        branchID:         e.branch_id,
        serviceTypeID:    e.service_type_id,
        slotID:           e.slot_id,
        staffID:          e.staff_id,
        status:           e.status,
        createdAt:        e.created_at
      }
    });
  }

  // AuditLogs
  for (const e of seedData.audit_logs){
    await prisma.auditLog.upsert({
      where: {id: e.id},
      update: {},
      create: {
        id:               e.id,
        actorID:          e.actor_id,
        actorRole:        e.actor_role,
        action:           e.action_type,
        targetType:       e.entity_type,
        targetID:         e.entity_id,
        branchID:         e.branch_id,
        metadata:         e.metadata,
        createdAt:        new Date(e.timestamp)
      }
    });
  }

  // Config (used for soft deleting)
  await prisma.config.upsert({
    where: {key: 'retention_period_days'},
    update: {},
    create: {
      key:                'retention_period_days',
      value:              '30'
    }
  })

  console.log('Seed Completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


