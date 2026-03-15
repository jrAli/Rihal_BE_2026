import express from 'express';
import { listSlots, createSlots} from '../controllers/slots.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import uploader from '../utils/uploader.js'; // used to handle form-date request

const slotRouter = express.Router();

slotRouter.get('/', listSlots);
slotRouter.post('/', authenticate, authorize('ADMIN', 'BRANCH_MANAGER'), uploader, createSlots);

export default slotRouter;

