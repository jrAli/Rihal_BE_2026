import { registerCustomerService,  loginUserService } from '../services/auth.service.js';
import fs from 'fs';

export const registerCustomer = async (req, res) => {
  try{
    const register = await registerCustomerService({
      ...req.body,
      id_image: req.file?.path
    });
    res.status(201).json(register);

  }catch(error){
    console.log("Error in registeration controller");
    if (req.file?.path) fs.unlink(req.file.path, ()=>{}); // delete uploaded files if there was an error
    res.status(400).json({error: error.message});
  }
};

export const loginUser = async (req, res) => {
  try{
    const token = await loginUserService(req.body);
    res.status(201).json(token);

  }catch(error){
    console.log("Error in login controller");
    res.status(400).json({error: error.message});
  }
};
