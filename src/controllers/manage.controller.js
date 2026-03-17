import { config } from 'dotenv';
import { viewAuditLogService, getImagePathService, 
         getAttachmentPathService, getStaffService, configSoftDeleteService, cleanUpSlotsService,
         getCustomerService, getCustomerByIDService, assignStaffService, exportAuditService } from '../services/manage.service.js';

export const viewAuditLog = async (req, res) => {
  try{
    const {id, role} = req.user;
    const auditLogs = await viewAuditLogService(id, role);
    res.json({auditLogs});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const viewCustomerIDImage = async (req, res) => {
  try{
    const {customerID} = req.params;
    const imagePath = await getImagePathService(customerID);
    res.sendFile(imagePath, (err)=>{
      if (err) res.status(404).json({error: "Image file not found"}); // raise an error if image not found
    });
  }catch(error){
    res.status(404).json({error: error.message});
  }
};

export const viewAttachement = async (req, res) => {
  try{
    const {id, role} = req.user;
    const {appointmentID} = req.params;
    const attachmentPath = await getAttachmentPathService(appointmentID, role, id);
    if (!attachmentPath){
      res.status(200).json({ message: 'No attachment for this appointment'});
    }else{
      res.sendFile(attachmentPath, (err)=>{
        if (err) res.status(404).json({error: "Attachment file not found on disk"});
      });
    }
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const listStaff = async (req, res) => {
  try{
    const {id, role} = req.user;
    const staff = await getStaffService(id, role);
    res.status(200).json({staff: staff});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const listCustomer = async (req, res) => {
  try{
    const customer = await getCustomerService();
    res.status(200).json({customer: customer});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const getCustomerByID = async (req, res) => {
  try{
    const {customerID} = req.params;
    const customer = await getCustomerByIDService(customerID);
    res.status(200).json({customer: customer});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const assignStaff = async (req, res) => {
  try{
    const {staffID, serviceID, branchID} = req.body;
    const { role: userRole, id: actorID } = req.user;

    // check if input validation
    if (!serviceID) throw new Error("serviceID is required");
    if (!staffID) throw new Error("staffID is required"); 

    const assigned = await assignStaffService(actorID, userRole, staffID, serviceID, branchID);
    res.status(200).json({assigned: assigned}); 
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const configSoftDelete = async (req, res) => {
  try{
    const expiration = req.body;
    const configed = await configSoftDeleteService(expiration.days);
    res.status(200).json({configed: configed}); 
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const cleanUpSlots = async (req, res) => {
  try{
    const cleaned = await cleanUpSlotsService();
    res.status(200).json({cleaned: cleaned}); 
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const exportAudit = async (req, res) => {
  try{
    const csv = await exportAuditService();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
    res.status(200).send(csv); 
  }catch(error){
    res.status(400).json({error: error.message});
  }
};