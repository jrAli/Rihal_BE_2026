import express from 'express';
import {listSlots} from '../controllers/slots.controller.js';

const slotRouter = express.Router();

slotRouter.get('/', listSlots);

export default slotRouter;

