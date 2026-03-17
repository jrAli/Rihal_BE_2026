import { ADDRGETNETWORKPARAMS } from 'dns';
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

export const getStaffService = async (userID, userRole) => {
  let staff = null;
  if (userRole === 'ADMIN'){
    staff = await prisma.staff.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        username: true,
        isActive: true
      },
    });
  }
  else if (userRole === 'BRANCH_MANAGER'){
    const manager = await prisma.staff.findFirst({
      where: {id: userID},
      select: {branchID: true},
    });  

    staff = await prisma.staff.findMany({
      where: {branchID: manager.branchID},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        username: true,
        isActive: true    
      },
    });
  }

  if (!staff) throw new Error("Unauthorized or staff not found");

  return staff;
};

export const getCustomerService = async () => {
  const customer = await prisma.customer.findMany({
    select: {
      id: true, 
      name: true,
      username: true,
      email: true, 
      isActive: true, 
      phone: true,
    },
  });

  return customer;
};

export const getCustomerByIDService = async (customerID) => {
  const customer = await prisma.customer.findFirst({
    where: {id: customerID},
    select: {
      id: true, 
      name: true,
      username: true,
      email: true, 
      isActive: true, 
      phone: true,
      idImagePath: true,
    },
  });

  if (!customer) throw Error("Failed to fetch customer");

  return customer;
};


export const assignStaffService = async (actorID, userRole, staffID, serviceID, branchID) => {
  // check if staff exist
  const staff = await prisma.staff.findUnique({
    where: {id: staffID},
    select: {branchID: true},
  });
  if (!staff) throw new Error("Staff not found or invalid staff id");
  
  // check if service exist
  const service = await prisma.serviceType.findUnique({where: {id: serviceID}, });
  if (!service) throw new Error("Service not found");  
  
  if (userRole === 'ADMIN'){
    if (!branchID) throw new Error("BranchID is required");

    // will rollout all the change if one of the transaction failed
    const result = await prisma.$transaction(async (tx) => {
      const output = {};

      // Assign staff to branch, Assumption: Admin can change staff branch
      if (branchID){
        output.staff = await tx.staff.update({
          where: {id: staffID}, 
          data: {branchID: branchID},
          select: { id: true, name: true, email: true, 
                    role: true, branchID: true, 
                    isActive: true, username: true 
                  }
        })
      }

      // Assign staff to service
      if (serviceID) {
        output.serviceAssignment = await tx.staffServiceType.createMany({
          data: [{staffID: staffID, ServiceTypeID: serviceID}],
          skipDuplicates: true, // no duplicates
        })
      }
      return output;
    })
    return result;
    // Managers can only assign services in their own branch
  }else if (userRole === 'BRANCH_MANAGER'){
    // prevent managers from assign services in other branches
    // if (branchID) throw new Error("Unauthorized: Branch Managers cannot assign staff to a branch");

    // get actual user branch id based on id
    const manager = await prisma.staff.findUnique({
      where: {id: actorID},
      select: {branchID: true},
    });
    
    if (!manager?.branchID) throw new Error("Manager has no branch assigned");
    if (staff.branchID !== manager.branchID) throw new Error("Staff does not belong to your branch");

    if (service.branchID !== manager.branchID) throw new Error("Service does not belong to this branch");

    const result = await prisma.staffServiceType.createMany({
      data: [{staffID: staffID, ServiceTypeID: serviceID}],
      skipDuplicates: true, // avoid duplicates
    });
    return {
      staff: await prisma.staff.findUnique({ 
        where: { id: staffID }, 
        select: { id: true, name: true, email: true, 
                  role: true, branchID: true, 
                  isActive: true, username: true 
                }}),
      serviceAssignment: result,
    };
  }
};