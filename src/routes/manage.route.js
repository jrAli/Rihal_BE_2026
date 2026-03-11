import express from 'express';
import { authorize } from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';
import { viewAuditLog } from '../controllers/manage.controller.js';

const manageRouter = express.Router();

manageRouter.get('/audit-logs', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), viewAuditLog);

export default manageRouter;