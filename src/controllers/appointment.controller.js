import { getAppointmentsService, getAppointmentByIdService } from '../services/appointment.service.js';

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
