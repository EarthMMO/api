import { Request, Response, NextFunction } from "express";

import CustomError from "exceptions/custom_error";
import { logger } from "utils/logger";
import { verifyJWT, JWTContent } from "utils/jwt";

export interface UserRequest extends Request {
  userDetails?: JWTContent; // or any other type
}
export const validateJWT = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwt: string | undefined = req.headers.authorization;
    if (!jwt) return res.status(401).send("Unauthorized");
    const userDetails = await verifyJWT(jwt);
    req.userDetails = userDetails;
    return next();
  } catch (error: any) {
    logger.error({ error });
    if (error instanceof CustomError)
      return res.status(error.status).send(error.message || "Unauthorized");
    logger.error("Error in validating JWT", error);
    res.status(401).send("Unauthorized");
  }
};
