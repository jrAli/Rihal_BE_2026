
/**
 * middleware to validate 
 *  1. presence all required fields are entered
 *  2. email format using basic regix
 *  3. password length (minimum 8 character)
*/
export const validateLoginCredentials = (req, res, next) => { 
  
  // TODO add id_image
  const {full_name, password, email, phone, username} = req.body;

  // Check for presence 
  if (!full_name) return res.status(400).json({error: "Full name is required!"});
  if (!password) return res.status(400).json({error: "Password is required!"});
  if (!email) return res.status(400).json({error: "Email is required!"});
  if (!phone) return res.status(400).json({error: "Phone is required!"});
  if (!username) return res.status(400).json({error: "Username is required!"});

  // check email format 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email regex
  if (!emailRegex.test(email)) return res.status(400).json({error: "Invalid email format"});

  if (password.length < 8)
    return res.status(400).json({error: "Password must be at least 8 characters long"});

  next();
}