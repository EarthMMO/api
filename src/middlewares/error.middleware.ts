import { Request, Response, NextFunction } from "express";

import CustomError from "exceptions/custom_error";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */

function errorMiddleware(
  error: TypeError | CustomError,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  let customError = error;

  if (!(customError instanceof CustomError)) {
    customError = new CustomError("Internal Server Error", 500, "00001", error);
  }
  response.status((customError as CustomError).status).send(customError);
}

export default errorMiddleware;
