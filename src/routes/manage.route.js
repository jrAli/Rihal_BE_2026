import express from 'express';
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import { viewAuditLog, viewCustomerIDImage, viewAttachement, listStaff } from '../controllers/manage.controller.js';

const manageRouter = express.Router();

manageRouter.get('/audit-logs', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), viewAuditLog);
manageRouter.get('/customers/:customerID/id-image', authenticate, authorize('ADMIN'), viewCustomerIDImage);
manageRouter.get('/appointments/:appointmentID/attachment', authenticate, authorize('ADMIN', 'BRANCH_MANAGER', 'STAFF', 'CUSTOMER'), viewAttachement);
manageRouter.get('/staff', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), listStaff);

export default manageRouter;

