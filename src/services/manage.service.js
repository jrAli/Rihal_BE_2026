import prisma from '../db/prisma.js';

export const viewAuditLogService = async (userID, role) => {
  let auditLog = null;

  if (role === 'ADMIN'){
    auditLog = await prisma.auditLog.findMany({
      where: {},
      select: {
        actorID: true,
        actorRole: true,
        action: true,
        targetType: true,
        targetID: true,
        createdAt: true,
        metadata: true
      }
    });

  }else if(role === 'BRANCH_MANAGER'){
    const manager = await prisma.staff.findUnique({
      where: {id: userID},
      select: {branchID: true},
    });

    auditLog = await prisma.auditLog.findMany({
      where: { branchID: manager.branchID },
      select: {
        actorID: true,
        actorRole: true,
        action: true,
        targetType: true,
        targetID: true,
        createdAt: true,
        metadata: true
      }
    });
  }

  if (!auditLog) throw new Error('Unauthorized');
  return {auditLog};
};