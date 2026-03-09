import prisma from '../db/prisma.js';

// get all customer's appointment
export const getAppointmentsService = async (cust_id) => {
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

export const getAppointmentByIdService = async (appointment_id, customer_id) => {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointment_id,
      customerID: customer_id
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      notes: true,
      attachPath: true,
      branch: {
        select: {
          name: true,
          address: true
        }
      },
      serviceType: {
        select: {
          description: true,
          durationMin: true,
          isActive: true,
          name: true
        }
      },
      slot: {
        select: {
          capacity: true,
          startTime: true,
          endTime: true
        }
      },
      staff: {
        select: {
          name: true,
          isActive: true,
          username: true,
          role: true
        }
      }

    }
  });
  if (!appointment) throw new Error("Appointment not found!");
  return appointment;
};

export const bookAppointmentService = async (slotID, customerID, attachPath) => {

};