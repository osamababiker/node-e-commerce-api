import { CustomAPIError } from '../errors/index.js';
import { isTokenValid } from '../utils/jwt.js';

export const authenticateUser = async (req, res, next) => {
  let token;

  // Check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } 
  // Check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new CustomAPIError.UnauthenticatedError('Authentication invalid');
  }

  try {
    const payload = isTokenValid(token);

    // Attach the user and their permissions to the req object
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError('Authentication invalid');
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomAPIError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};
