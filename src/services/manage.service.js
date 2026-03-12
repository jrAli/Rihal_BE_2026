import prisma from '../db/prisma.js';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const getImagePathService = async (customerID) => {
  // fetch image path from database
  const imagePathName = await prisma.customer.findFirst({
    where: {id: customerID},
    select: {idImagePath: true},
  });

  // check if image Path exist
  if (!imagePathName) throw new Error("Image not found or customer does not exist!");
  
  // reconstruct relative image path
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const imagePath = path.join(__dirname, '../../uploads/id_images', imagePathName.idImagePath);
 
  return imagePath;
};


export const getAttachmentPathService = async (appointmentID, userRole, userID) => {
  // check roles
  if (userRole === 'CUSTOMER'){
    const authorizedCustomer = await prisma.appointment.findFirst({
      where: {id: appointmentID, customerID: userID},
    });

    if (!authorizedCustomer) throw new Error("Unauthorized");
  }

  const attachmentPathName = await prisma.appointment.findFirst({
    where: {id: appointmentID},
    select: {attachPath: true},
  });
  
  // optional attachment
  if (!attachmentPathName || !attachmentPathName.attachPath) return null; 

  // reconstruct relative attachment file 
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const attachmentPath = path.join(__dirname, '../../uploads/attachments', attachmentPathName.attachPath);

  return attachmentPath;
};


