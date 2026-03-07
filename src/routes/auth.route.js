import express from 'express';
import { registerCustomer } from '../controllers/auth.controller.js';
import { validateLoginCredentials } from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', validateLoginCredentials, registerCustomer);

export default authRouter;