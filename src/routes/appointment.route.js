import express from 'express';
import uploader from '../utils/uploader.js';
import { getAppointmentsByID, getCustomerAppointments, bookAppointment } from '../controllers/appointment.controller.js'; 
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';

const appointmentRouter = express.Router();

appointmentRouter.get('/', authenticate, authorize('CUSTOMER'), getCustomerAppointments);
appointmentRouter.get('/:appt_id', authenticate, authorize('CUSTOMER'), getAppointmentsByID); // in this context it's appointment's id
appointmentRouter.post('/', uploader, authenticate, authorize('CUSTOMER'), bookAppointment);


export default appointmentRouter;


