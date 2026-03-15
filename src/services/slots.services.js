import prisma from '../db/prisma.js';

export const getSlotByParam = async (branchID, serviceTypeId, date) => {
  // Validates required query param
  if (!branchID) throw new Error("Error, branchID param is required");
  if (!serviceTypeId) throw new Error("Erorr, serviceTypeID is required");

  // Creating an object that will be used to query.
  const where = {
    branchID: branchID,
    serviceIDType: serviceTypeId,
    isAvailable: true,
    deleteAt: null
  };

  // Optional param
  if (date){
    where.startTime = { // append startTime if date is provided
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
    }
  }

  const slots = await prisma.slot.findMany({where});
  if (!slots) throw new Error("Error: Could not get slots");
  return slots;
};

export const createSlotsService = async (slotData, userID, userRole) => {
  // normalize the array for bulk request slots
  const isArray = Array.isArray(slotData); // check if is in bulk
  const slots = isArray ? slotData : [slotData];

  // get manger's branchID 
  let userBranchID = null;
  if (userRole === 'BRANCH_MANAGER'){
    const manager  = await prisma.staff.findUnique({where: {id: userID}});
    if (!manager ) throw new Error("Manager not found");
    userBranchID = manager .branchID;
  }

  // valate entry
  for (const slot of slots){
    const { branchID, serviceIDType } = slot;
    const staffID = slot.staffID ?? null; // extract optional staffID otherwise default to null

    // check manager can create slots
    if (userRole === 'BRANCH_MANAGER' && userBranchID !== branchID)
      throw new Error("Manager can only create slots for their own branch"); 

    // servicetype belong to the same branch as the slot
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceIDType} 
    });
    if (!serviceType || serviceType.branchID !== branchID) 
      throw new Error("Service type does not belong to this branch");

    // check staff belong to the same branch as the slot
    if (staffID){
      const staff = await prisma.staff.findUnique({
        where: {id: staffID}
      });
      if (!staff || staff.branchID !== branchID)
        throw new Error("Staff does not belong to this branch");
      
      // Check Staff is not double-booked (same staff, overlapping time)
      const conflict = await prisma.slot.findFirst({
        where: {
          staffID,
          deleteAt: null,
          AND: [
            {startTime: {lt: new Date(slot.endTime)}},
            {endTime: {gt: new Date(slot.startTime)}}
          ]
        }
      });
      if (conflict) throw new Error("Staff or slot is already scheduled this time");
    }
  }
  
  // create slots in a bulk, one failed operation causes the service to fail as a whole
  const created = await prisma.$transaction(
    slots.map(slot => prisma.slot.create({
      data: {
        branchID: slot.branchID,
        serviceIDType: slot.serviceIDType,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        staffID: slot.staffID ?? null,
        capacity: slot.capacity ?? 1,
        isAvailable: true,
      }
    }))
  );
  return created;
};

export const updateSlotsService = async (slotData, slotID, userID, userRole) => {
  // check if slot exist
  const slot = await prisma.slot.findUnique({where: {id: slotID},});
  if (!slot) throw new Error("Slot not found");
  
  const { serviceIDType, staffID: newStaffID, startTime, endTime } = slotData;

  // check slot is not deleted (soft-deleted)
  if (slot.deleteAt) throw new Error("Cannot updated deleted slot");

  // check update scope based on role (ADMIN/MANAGER)
    // get manger's branchID 
  let userBranchID = null;
  if (userRole === 'BRANCH_MANAGER'){
    const manager  = await prisma.staff.findUnique({where: {id: userID}});
    if (!manager ) throw new Error("Manager not found");
    userBranchID = manager.branchID;
  }

  if (userRole === 'BRANCH_MANAGER' && slot.branchID !== userBranchID)
    throw new Error("Managers can only update slots in their own branch");

  // check if service belong to this branch
  if (serviceIDType){
    const serviceType = await prisma.serviceType.findUnique({where: {id: serviceIDType }});
    if (!serviceType || serviceType.branchID !== slot.branchID)
      throw new Error("Service type does not belong to this branch!");
  }

  // check if staff belong to same branch 
  if (newStaffID){
    const staff = await prisma.staff.findUnique({where: {id: newStaffID}});
    if (!staff || staff.branchID !== slot.branchID)
      throw new Error("Staff does not belong to this branch");
    
    // check for double checking
    const conflict = await prisma.slot.findFirst({
      where: {
        staffID: newStaffID,
        deleteAt: null,
        id: {not: slotID},
        AND: [
          {startTime: {lt: new Date(endTime ?? slot.endTime)}},
          {endTime: {gt: new Date(startTime ?? slot.startTime)}}
        ]
      }
    });
    if (conflict) throw new Error("Staff or slot is already scheduled this time");
  }

  const updated = await prisma.slot.update({
    where: {id: slotID},
    data: { // spread operator (...) only passes updated field
      ...(serviceIDType && { serviceIDType }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
      ...(slotData.staffID !== undefined && { staffID: slotData.staffID }),
      ...(slotData.capacity && { capacity: slotData.capacity }),
      ...(slotData.isAvailable !== undefined && { isAvailable: slotData.isAvailable }),
    }
  });

  return updated; 
};