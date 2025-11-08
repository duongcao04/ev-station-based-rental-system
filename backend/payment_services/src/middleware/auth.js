// Authentication & Authorization Middleware
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

// Middleware để verify JWT token từ Auth Service
export const authenticate = (req, res, next) => {
    try {
        // Lấy token từ HTTP-only cookie (ưu tiên) hoặc Authorization header (fallback)
        let token = req.cookies?.accessToken;

        // Fallback: Nếu không có trong cookie, thử lấy từ Authorization header
        if (!token) {
            const authHeader = req.headers['authorization'];
            token = authHeader && authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required', message: 'Token not provided' });
        }

        // Verify JWT token với secret từ Auth Service
        jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ error: 'Token expired', message: 'Please login again' });
                }
                return res.status(403).json({ error: 'Invalid token', message: err.message });
            }

            // Token hợp lệ, lấy thông tin user từ decoded token
            // Token payload: { userId: user.id, role: user.role }
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

// Middleware để check phân quyền 
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: allowedRoles,
                current: req.user.role
            });
        }

        next();
    };
};

// Middleware để check ownership (renter chỉ được xem booking của mình)
export const checkOwnership = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'staff') {
        return next(); // Admin và staff có thể xem tất cả
    }

    if (req.user.role === 'renter') {
        const requestedUserId = req.params.user_id || req.query.user_id || req.body.user_id;
        if (requestedUserId && requestedUserId != req.user.id) {
            return res.status(403).json({ error: 'Can only access your own bookings' });
        }
    }

    next();
};
