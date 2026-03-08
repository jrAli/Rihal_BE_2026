import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // parse token
  if (!token) return res.status(401).json({error: "Missing token"});
  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET) // decodes payload
    next();
  }catch(error){
    res.status(401).json({error: 'Invalid or expired token'});
  }
};