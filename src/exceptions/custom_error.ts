class CustomError extends Error {
  status: number; // HTTP status code

  errorCode: string; // Custom error codes. Not HTTP status codes.

  message: string;

  errorDetails: any;

  constructor(
    message: string = 'Default Error',
    status: number = 500,
    errorCode: string = '00000',
    errorDetails: any = {}
  ) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    this.errorDetails = { message, errorDetails };
  }
}

export default CustomError;
