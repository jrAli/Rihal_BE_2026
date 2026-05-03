/**
 * Middleware function used to authorize user.
*/
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) // from jwt token
      return res.status(403).json({error: 'Forbidden'}); // raise an error 
    next();
  }
}