import { getCustomerAppointmentsService } from '../services/appointment.service.js';

export const getCustomerAppointments = async (req, res) => {
  try{
    const appointments = await getCustomerAppointmentsService();
    res.json({appointments}); 
  }catch(error){
    console.log("Debug: Failed to get customer's appointment");
    res.status(400).json({error: error.message});
  }
};