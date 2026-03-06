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
}