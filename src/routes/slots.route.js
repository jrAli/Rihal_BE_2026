import express from 'express';
import { listSlots, createSlots, updateSlots,  softDeleteSlots } from '../controllers/slots.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import uploader from '../utils/uploader.js'; // used to handle form-date request

const slotRouter = express.Router();

slotRouter.get('/', listSlots);
slotRouter.post('/', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), uploader, createSlots);
slotRouter.patch('/:slotID', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), uploader, updateSlots);
slotRouter.delete('/:slotID', authenticate, authorize('ADMIN'), softDeleteSlots);

export default slotRouter;

