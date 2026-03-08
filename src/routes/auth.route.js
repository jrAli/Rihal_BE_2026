import express from 'express';
import { registerCustomer, loginUser } from '../controllers/auth.controller.js';
import { validateLogin, validateRegisterationForm } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.js';
import multer from 'multer';

const authRouter = express.Router();
const upload = multer({dest: 'uploads/'}); // stores the file 

// In order for login router to parse form-data, we have to must upload.single('file')
authRouter.post('/register', uploadImage.single('id_image'), validateRegisterationForm, registerCustomer);
authRouter.post('/login', upload.single('file'), validateLogin, loginUser);

export default authRouter;