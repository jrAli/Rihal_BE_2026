import { getCustomerAppointmentsService, 
         getAppointmentByIdService, 
         bookAppointmentService, 
         cancelAppointmentsService, rescheduleAppointmentsService,
         getAllAppointmentsService, getBranchAppointmentsService, getAssignedAppointmentsService} from '../services/appointment.service.js';
import fs from 'fs';

export const listAppointments = async (req, res) => {
  try{
    const {role} = req.user;
    let appointments = null;
    console.log("[Debug] USER: ",  req.user);
    // based on role
    console.log(role);
    if (role === 'ADMIN') appointments = await getAllAppointmentsService();
    else if (role === 'BRANCH_MANAGER') appointments = await getBranchAppointmentsService(req.user.id);
    else if (role === 'STAFF') appointments = await getAssignedAppointmentsService(req.user.id);
    else if (role === 'CUSTOMER') appointments = await getCustomerAppointmentsService(req.user.id); 
    
    res.json({appointments}); 
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const getAppointmentsByID = async (req, res) => {
  try{
    const { appt_id } = req.params; // extract id from /:id
    const appointmentByID = await getAppointmentByIdService(appt_id, req.user.id);
    res.json({appointment: appointmentByID});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const bookAppointment = async (req, res) => {
  try{
    const {slotID} = req.body;
    const customerID = req.user.id;
    const attachPath = req.file?.path; // optional file
    const appointment = await bookAppointmentService(slotID, customerID, attachPath);
    res.json({booked: appointment}); 
  }catch(error){
    if (req.file?.path) fs.unlink(req.file.path, ()=>{}); // delete uploaded files if there was an error
    res.status(400).json({error: error.message});
  }
};

export const cancelAppointments = async (req, res) => {
  try{
    const { appt_id } = req.params;
    const userID = req.user.id;
    const appointment = await cancelAppointmentsService(userID, appt_id);
    res.json({removed: appointment})
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const rescheduleAppointments = async (req, res) => {
  try{
    const { appt_id } = req.params;
    const userID = req.user.id;
    const { newSlotID } = req.body;
    console.log(newSlotID)
    const newAppointment = await rescheduleAppointmentsService(userID, appt_id, newSlotID);
    res.json({Scheduled: newAppointment});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};