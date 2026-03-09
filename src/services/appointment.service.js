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

  if (!attachPath) attachPath = null;
  
  const slotInformation = await prisma.slot.findFirst({
    where: {id: slotID},
    select: {
      id: true,
      staffID: true,
      branchID: true, 
      serviceIDType: true,
      isAvailable: true,
      deleteAt: true,
    }
  });
  
  // Check if slot exist
  if (!slotInformation) throw new Error("Slot not found!");

  // Check if slot is available 
  if (slotInformation.deleteAt) throw new Error("slot not available!");
  if (!slotInformation.isAvailable) throw new Error("Slot not available!");

  try{
    const appointmentBook = await prisma.appointment.create({
      data: {
        attachPath: attachPath,
        branchID: slotInformation.branchID,
        customerID: customerID,
        serviceTypeID: slotInformation.serviceIDType,
        slotID: slotInformation.id,
        staffID: slotInformation.staffID,
        status: "BOOKED"
      }
    });
  
    return appointmentBook;
  }catch(error){
    if (error.code === 'P2002') throw new Error('Slot is already booked'); // catch database error
    throw error;
  }
};