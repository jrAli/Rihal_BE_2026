import express from 'express';
import uploader from '../utils/uploader.js';
import { getCustomerAppointments } from '../controllers/appointment.controller.js'; 
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';

const appointmentRouter = express.Router();

appointmentRouter.get('/', authenticate, authorize('CUSTOMER'), getCustomerAppointments);
appointmentRouter.post('/', uploader);

export default appointmentRouter;


