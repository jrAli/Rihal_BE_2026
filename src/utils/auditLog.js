import prisma from '../db/prisma.js';

export const logAudit = async (actorID, actorRole, action, targetType, targetID, branchID = null, metadata = null) => {
  try{
    await prisma.auditLog.create({
      data: {
        actorID,
        actorRole,
        action,
        targetType,
        targetID,
        branchID,
        metadata,
      }
    });
  }catch(error){
    console.error("Audit log failed: ", error.message);
  }
}