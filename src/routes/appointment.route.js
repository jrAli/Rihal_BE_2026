import express from 'express';
import { getAppointmentsByID, getCustomerAppointments, bookAppointment, cancelAppointments} from '../controllers/appointment.controller.js'; 
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadAttachment  } from '../middlewares/upload.js';


const appointmentRouter = express.Router();

// Appointment API
appointmentRouter.get('/', authenticate, authorize('CUSTOMER'), getCustomerAppointments);
appointmentRouter.post('/', authenticate, authorize('CUSTOMER'), uploadAttachment.single('attachments'), bookAppointment);
appointmentRouter.get('/:appt_id', authenticate, authorize('CUSTOMER'), getAppointmentsByID); // in this context it's appointment's id
appointmentRouter.delete('/:appt_id', authenticate, authorize('CUSTOMER'), cancelAppointments);

export default appointmentRouter;



