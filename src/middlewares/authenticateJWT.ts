import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return errorResponse(res, 401, 'Unauthorized');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtPayload;

    if (!decoded) {
      throw new Error('Invalid token');
    }

    req.user = { id: decoded.userId, name: decoded.name };

    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Token expired, please login again'
        : error instanceof jwt.JsonWebTokenError
        ? 'Invalid token, please login again'
        : error instanceof jwt.NotBeforeError
        ? 'Token not active yet, please wait'
        : error instanceof Error
        ? error.message
        : 'Unauthorized';

    res.status(401).json({ message });
  }
};
