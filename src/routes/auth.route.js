import express from 'express';
import { registerCustomer } from '../controllers/auth.controller.js';
import { validateLoginCredentials } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', uploadImage.single('id_image'), validateLoginCredentials, registerCustomer);

export default authRouter;