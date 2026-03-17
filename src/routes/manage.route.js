import express from 'express';
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import { viewAuditLog, viewCustomerIDImage, getCustomerByID,
         viewAttachement, listStaff, listCustomer,assignStaff, configSoftDelete } from '../controllers/manage.controller.js';
import uploader from '../utils/uploader.js';
const manageRouter = express.Router();

manageRouter.get('/audit-logs', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), viewAuditLog);
manageRouter.get('/customers/:customerID/id-image', authenticate, authorize('ADMIN'), viewCustomerIDImage);
manageRouter.get('/appointments/:appointmentID/attachment', authenticate, authorize('ADMIN', 'BRANCH_MANAGER', 'STAFF', 'CUSTOMER'), viewAttachement);
manageRouter.get('/staff', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), listStaff);
manageRouter.get('/customers', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), listCustomer);
manageRouter.get('/customers/:customerID', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), getCustomerByID); 
manageRouter.post('/staff/assign', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), uploader, assignStaff); 
manageRouter.patch('/config/retention', authenticate, authorize('ADMIN'), uploader, configSoftDelete);



export default manageRouter;

