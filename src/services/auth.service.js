import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';

// register 
export const registerCustomerService = async (form) => {
  // check if user exist in database using email as constraint
  // TODO extract idimagepath for database
  const {email, full_name, password, phone, username} = form; 
  const temp_idImagePath = "placeholder.jpg";

  console.log("checking email: ", email);

  const userExist = await prisma.customer.findUnique({
    where: {email: email},
  });

  if (userExist) throw new Error("Registeration Error: User already exist!");

  // store validated user on database
  const customer = await prisma.customer.create({
    data: {
      email: email,
      name: full_name,
      password: await bcrypt.hash(password, 12),
      phone: phone,
      username: username,
      idImagePath: temp_idImagePath
    }
  });

  // Acknowledge user by sending part of the form 
  const ack = {user: {
    name: full_name,
    email: email,
    username: username
  }}; 
  return ack;
};