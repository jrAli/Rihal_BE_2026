import prisma from '../db/prisma.js';

export const getAllBranch = async () => {
  const branch = await prisma.branch.findMany(); 
  if (!branch) throw new Error("Error: Could not get all branch");
  return branch
};

export const getBranchServiceByID = async (paramID) => {
  const serviceBranch = await prisma.serviceType.findMany({
    where: {branchID: paramID},
    select: {
      id: true,
      name: true,
      description: true,
      branch: {
        select: {
          name: true
        }
      }
    }
  }); 
  if (!serviceBranch) throw new Error("Error: Could not get branch's service");
  return serviceBranch;
};