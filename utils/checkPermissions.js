import { CustomAPIError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  
  throw new CustomAPIError.UnauthorizedError('Not authorized to access this route');
};

export default checkPermissions;
