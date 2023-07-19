const { StatusCodes } = require('http-status-codes')

const isAdmin = (req, res, next) => {
    // Check if the authenticated user is an admin
    // You can access the user object from the request, attached during authentication
    if (req.user && req.user.role === 'admin') {
      // User is an admin, proceed to the next middleware or route handler
      next();
    } else {
      // User is not an admin, return an error response
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Access forbidden. Admin privileges required.' });
    }
  };
  
  module.exports = isAdmin