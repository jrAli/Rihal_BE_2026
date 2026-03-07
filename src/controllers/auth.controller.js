import { registerCustomerService } from '../services/auth.service.js';
// import { uploadImage } from '../middlewares/upload.js';

export const registerCustomer = async (req, res) => {
  try{
    const register = await registerCustomerService(req.body);
    res.status(201).json(register);
  }catch(error){
    console.log("Error in authentication controller");
    res.status(400).json({error: error.message});
  }
};