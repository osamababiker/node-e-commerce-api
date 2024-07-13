class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name; // Ensures the error name is set correctly
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}

export default CustomAPIError;
