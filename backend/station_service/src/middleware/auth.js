import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const authenticate = (req, res, next) => {
    try {
        const internalSecret = req.headers['x-internal-secret'];
        const expectedSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

        if (internalSecret && internalSecret === expectedSecret) {
            req.user = {
                id: 'internal-service',
                role: 'admin'
            };
            return next();
        }

        let token = req.cookies?.accessToken;

        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required', message: 'Token not provided' });
        }

        jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ error: 'Token expired', message: 'Please login again' });
                }
                return res.status(403).json({ error: 'Invalid token', message: err.message });
            }

            req.user = {
                id: decoded.userId,
                role: decoded.role
            };

            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed', details: error.message });
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Authentication required" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions", required: allowedRoles, current: req.user.role });
        }
        next();
    };
};

export const ensureStationOwnership = (req, res, next) => {
    const isAdmin = req.user?.role === "admin";
    const isStaff = req.user?.role === "staff";
    if (!isStaff && !isAdmin) {
        return res.status(403).json({ error: "Only staff/admin can modify stations" });
    }

    if (isAdmin) {
        return next();
    }

    const targetUserId = req.params.user_id ?? req.body.user_id;
    if (!targetUserId) {
        return res.status(400).json({ error: "user_id is required" });
    }

    if (String(targetUserId) !== String(req.user.id)) {
        return res.status(403).json({
            error: "You can only modify your own station",
            requested: targetUserId,
            current: req.user.id
        });
    }

    next();
};