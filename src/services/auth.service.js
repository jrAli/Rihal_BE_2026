import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';

// register 
export const registerCustomerService = async (form) => {
  // check if user exist in database using email as constraint
  console.log("Debug: ", form);

  const {email, full_name, password, phone, username, id_image} = form; 

  const emailExist = await prisma.customer.findUnique({
    where: {email: email},
  });

  const usernameExist = await prisma.customer.findUnique({
    where: {username: username}
  });

  if (emailExist) throw new Error("Registeration Error: User already exist!");
  if (usernameExist) throw new Error("Registeration Error: username taken, please choose other username!");

  // store validated user on database
  const customer = await prisma.customer.create({
    data: {
      email: email,
      name: full_name,
      password: await bcrypt.hash(password, 12),
      phone: phone,
      username: username,
      idImagePath: id_image
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