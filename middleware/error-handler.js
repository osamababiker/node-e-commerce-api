import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const CustomAPIError = {
    // Set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  };

  if (err.name === 'ValidationError') {
    CustomAPIError.msg = Object.values(err.errors).map(item => item.message).join(',');
    CustomAPIError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    CustomAPIError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    CustomAPIError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    CustomAPIError.msg = `No item found with id: ${err.value}`;
    CustomAPIError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(CustomAPIError.statusCode).json({ msg: CustomAPIError.msg });
};

export default errorHandlerMiddleware;
