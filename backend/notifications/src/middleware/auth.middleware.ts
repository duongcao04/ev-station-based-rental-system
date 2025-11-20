import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';

const authSecret = String(process.env.AUTH_ACCESS_TOKEN_SECRET)
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required', message: 'Token not provided' });
        }

        jwt.verify(token, authSecret, (err: any, decoded: any) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ error: 'Token expired', message: 'Please login again' });
                }
                return res.status(403).json({ error: 'Invalid token', message: err.message });
            }

            (req as any).user = {
                id: decoded.userId,
                role: decoded.role,
                station_id: decoded.station_id || null
            };

            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed', details: (error as Error).message });
    }
};
export const authMiddleware = { authenticate }