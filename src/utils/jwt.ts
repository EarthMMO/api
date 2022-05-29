import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateSecret } from './secret';
import CustomError from '../exceptions/custom_error';
import { logger } from './logger';
/**
 * creates a jwt token using the secret provided
 * @param body
 * @param secret
 * @returns
 */

export interface JWTContent {
  id: string;
  firstName: string;
  ethereumAddress: string;
  suffix: number;
}

export const createToken = async (body: JWTContent, secret: string) => {
  return new Promise((resolve, reject) => {
  try {
  console.log("jwt : ",+(process.env.JWT_EXPIRY as string))
      var token = jwt.sign({ ...body }, secret, {
        expiresIn: +(process.env.JWT_EXPIRY as string),

        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      });
      return resolve(token);
    } catch (error: any) {
      logger.error('Error : ', error);
      reject(
        new CustomError(
          error.message || 'Something went wrong',
          500,
          undefined,
          error
        )
      );
    }
  });
};

/**
 * Verifies the JWT with the secret Provided
 * @param token
 * @param secret
 * @returns
 */

export const verifyJWT = async (token: string): Promise<JWTContent> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.decode(token) as JWTContent;
      if (!decoded)
        return reject(
          new CustomError('Error in decoding', 401, undefined, decoded)
        );
      if (!decoded?.suffix)
        return reject(
          new CustomError('Error in decoding', 401, undefined, decoded)
        );
   
      const secret = generateSecret(decoded?.suffix as number);
      jwt.verify(
        token,
        secret,
        { issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE },
        function (err, decoded) {
          if (err) {
            logger.error({ err });
            return reject(
              new CustomError('Error in verifying JWT', 401, undefined, decoded)
            );
          }
     
          const _decode = decoded as JwtPayload;
          const { id, firstName, ethereumAddress, suffix } = _decode;

          return resolve({
            id,
            firstName,
            ethereumAddress,
            suffix: Number(suffix),
          });
        }
      );
    } catch (e) {
      logger.error({ e });
      if (e instanceof CustomError) return reject(e);
      return reject(
        new CustomError('Error in verifying JWT', 401, undefined, e)
      );
    }
  });
};
