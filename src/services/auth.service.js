import prisma from '../db/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// register 
export const registerCustomerService = async (form) => {
  // check if user exist in database using email as constraint

  const {email, full_name, password, phone, username, id_image} = form; 

  const emailExist = await prisma.customer.findUnique({
    where: {email: email},
  });

  const usernameExist = await prisma.customer.findUnique({
    where: {username: username},
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

// Login user then returns jwt authorization token
export const loginUserService = async ({email, password}) => {
  // Check if user exist using email
  let user = await prisma.customer.findUnique({
    where: { email },
    select: { id: true, password: true, role: true }
  });

  if (!user) {
    user = await prisma.staff.findUnique({
      where: { email },
      select: { id: true, password: true, role: true, branchID: true }
    });
  }
  if (!user) throw new Error("Invalid Credentials");
  
  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) throw new Error("Invalid Credentials");

  // Generate JWT authorization token synchronously (assumptions: login process is fast) 
  const token = jwt.sign(
    {id: user.id, role: user.role}, // payload
    process.env.JWT_SECRET,
    {expiresIn: '7d'},
  );

  return {token};
};