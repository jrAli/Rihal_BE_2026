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
    },
  });
  return appointments;
};

// List all the appointments for ADMIN role
export const getAllAppointmentsService = async () => {
  const appointment = await prisma.appointment.findMany();
  return appointment;
};

// List all the appointments based on branch for BRANCH_MANAGER role
export const getBranchAppointmentsService = async (managerID) => {
  // get branchid for manager
  const manager = await prisma.staff.findFirst({
    where: {id: managerID},
    select: {branchID: true},
  });

  if (!manager) throw new Error("Manager not found!");
  
  console.log("[Debug] Manager ID: ", manager.branchID);

  const appointment = await prisma.appointment.findMany({
    where: {branchID: manager.branchID},
    select: {
      id: true,
      status: true,
      createdAt: true,
      branch: {
        select: {
          id: true,
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
      },
      staff: {
        select: {
          id: true,
          email: true, 
          name: true,
          role: true
        }
      }
    },
  });
  return appointment;
};

export const getAssignedAppointmentsService = async (staffID) => {
  const appointment = await prisma.appointment.findMany({
    where: {staffID: staffID},
    select: {
      id: true,
      status: true,
      createdAt: true,
      branch: {
        select: {
          id: true,
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
      },
      staff: {
        select: {
          id: true,
          email: true, 
          name: true,
          role: true
        }
      }
    }
  });
  return appointment;
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

    },
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
      capacity: true,
    },
  });
  
  // Check if slot exist
  if (!slotInformation) throw new Error("Slot not found!");

  // Check if slot is available 
  if (slotInformation.deleteAt) throw new Error("slot not available!");
  if (!slotInformation.isAvailable) throw new Error("Slot not available!");

  const appointmentCount = await prisma.appointment.count({
    where: {slotID: slotID, status: "BOOKED"},
  });

  if (appointmentCount >= slotInformation.capacity) 
    throw new Error("Slot is fully booked");

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

export const cancelAppointmentsService  = async (userID, appointment_id) => {
  // find user appointment that will be delete
  const isAppointmentExist = await prisma.appointment.findFirst({
    where: {customerID: userID, id: appointment_id, status: "BOOKED"},
    select: {slotID: true},
  }); 

  if (!isAppointmentExist) throw new Error('Appointment not found or already cancelled');

  // delete appointment by updating status to CANCELLED
  await prisma.appointment.update({
    where: {id: appointment_id, customerID: userID},
    data: {status: "CANCELLED"},
  });

  return {
    message: 'Appointment cancelled successfully',
    appointment_id: appointment_id,
    status: 'CANCELLED'
  };
};

export const rescheduleAppointmentsService = async (userID, appointmentID, newSlotID) => {
  // find appointment 
  const appointment = await prisma.appointment.findFirst({
    where: {id: appointmentID, customerID: userID, status: "BOOKED"},
  });

  if (!appointment) throw new Error("Appointment not found or not booked");

  // check if the slot exist and avaible
  const newSlot = await prisma.slot.findFirst({
    where: {id: newSlotID},
  });

  // check if slot is not deleted (soft deleted)
  if (!newSlot) throw new Error("Slot not found");
  if (newSlot.deleteAt) throw new Error("Slot not available");

  // check slot capacity
  const appointmentCount  = await prisma.appointment.count({
    where: {slotID: newSlotID, status: "BOOKED"},
  });

  if (appointmentCount >= newSlot.capacity) throw new Error('Slot is fully booked');

  // update appointment with new slot
  await prisma.appointment.update({
    where: {id: appointmentID},
    data: {
      slotID: newSlotID,
      staffID: newSlot.staffID,
      branchID: newSlot.branchID,
      serviceTypeID: newSlot.serviceIDType,
    }
  });

  return {
    message: 'Appointment rescheduled successfully!',
    appointmentID,
    newSlotID: newSlotID
  };
};

export const changeAppointmentStatusService = async (userID, role, appointmentID, newStatus) => {
  // check if allowed status
  const allowedStatuses = ["CHECK_IN", "NO_SHOW", "COMPLETED"];
  if (!allowedStatuses.includes(newStatus)) throw new Error("Invalid status");

  // find appointment based on role
  let appointment = null;

  if (role === 'ADMIN'){
    appointment = await prisma.appointment.findFirst({
      where: {id: appointmentID},
    });
  }

  else if (role === 'BRANCH_MANAGER'){
    const manager = await prisma.staff.findUnique({
      where: {id: userID},
      select: {branchID: true},
    });
    appointment = await prisma.appointment.findFirst({
      where: {id: appointmentID, branchID: manager.branchID},
    });
  }

  else if (role === 'STAFF'){
    appointment = await prisma.appointment.findFirst({
      where: {id: appointmentID, staffID: userID},
    });
  }

  if (!appointment) throw new Error("Appointment not found or unauthorized!");

  const status = await prisma.appointment.update({
    where: {id: appointmentID},
    data: {status: newStatus},
  });

  return {
    message: "Successfully changed to status",
    newStatus: status 
  };
};