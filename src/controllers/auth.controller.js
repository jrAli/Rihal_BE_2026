import { registerCustomerService } from '../services/auth.service.js';
import fs from 'fs';

export const registerCustomer = async (req, res) => {
  try{
    const register = await registerCustomerService({
      ...req.body,
      id_image: req.file?.path
    });
    res.status(201).json(register);
  }catch(error){
    console.log("Error in authentication controller");
    if (req.file?.path) fs.unlink(req.file.path, ()=>{}); // delete uploaded files if there was an error
    res.status(400).json({error: error.message});
  }
};

