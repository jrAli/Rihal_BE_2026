import { getAppointmentsService, getAppointmentByIdService, bookAppointmentService } from '../services/appointment.service.js';
import fs from 'fs';

export const getCustomerAppointments = async (req, res) => {
  try{
    const appointments = await getAppointmentsService(req.user.id);
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