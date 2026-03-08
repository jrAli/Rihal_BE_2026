import prisma from '../db/prisma.js';

// get all customer's appointment
export const getCustomerAppointmentsService = async (cust_id) => {
  const appointments = await prisma.appointment.findMany({
    where: { customerID: cust_id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      branch: {
        select: {
          name: true,
          address: true
        }
      },
      serviceType: {
        select: {
          name: true,
          durationMin: true
        }
      },
      slot: {
        select: {
          startTime: true,
          endTime: true
        }
      }
    }
  });
  return appointments;
};