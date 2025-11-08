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
            // Token payload: { userId: user.id, role: user.role, station_id?: station.id }
            req.user = {
                id: decoded.userId,
                role: decoded.role,
                station_id: decoded.station_id || null  // station_id có thể không có nếu không phải staff
            };

            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Authentication failed', details: error.message });
    }
};

// Middleware để check permissions
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
export const checkOwnership = async (req, res, next) => {
    try {
        // Admin và Staff có thể truy cập tất cả bookings
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            return next();
        }

        // Renter chỉ được truy cập booking của mình
        if (req.user.role === 'renter') {
            const { id } = req.params; // booking_id từ URL

            if (!id) {
                return res.status(400).json({ error: 'Booking ID is required' });
            }

            // Lấy thông tin booking để kiểm tra user_id
            const pool = (await import('../config/db.js')).default;
            const { rows } = await pool.query(
                'SELECT user_id FROM bookings WHERE booking_id = $1',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = rows[0];
            if (booking.user_id != req.user.id) {
                return res.status(403).json({
                    error: 'Can only access your own bookings',
                    booking_owner: booking.user_id,
                    current_user: req.user.id
                });
            }
        }

        next();
    } catch (error) {
        console.error('checkOwnership error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Middleware để kiểm tra quyền check-in theo station
export const checkCheckinPermission = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Admin có thể check-in tại bất kỳ station nào
        if (req.user.role === 'admin') {
            return next();
        }

        // Staff chỉ có thể check-in tại station của mình
        // TODO: Tạm thời bỏ qua check station_id vì chưa có station
        // Khi có station, sẽ bật lại check này
        if (req.user.role === 'staff') {
            // Kiểm tra booking có tồn tại không
            const pool = (await import('../config/db.js')).default;
            const { rows } = await pool.query(
                'SELECT start_station_id FROM bookings WHERE booking_id = $1',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            // TODO: Khi có station, uncomment phần check station_id sau:
            // const booking = rows[0];
            // if (req.user.station_id && booking.start_station_id !== req.user.station_id) {
            //     return res.status(403).json({
            //         error: 'Staff can only check-in at their assigned station',
            //         required_station: booking.start_station_id,
            //         staff_station: req.user.station_id
            //     });
            // }

            // Tạm thời: Staff có thể check-in tại bất kỳ station nào
        }

        // Renter không được phép check-in
        if (req.user.role === 'renter') {
            return res.status(403).json({
                error: 'Renters are not allowed to perform check-in operations'
            });
        }

        next();
    } catch (error) {
        console.error('checkCheckinPermission error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Middleware để kiểm tra quyền return (Admin và Staff có thể return tại bất kỳ station nào)
export const checkReturnPermission = (req, res, next) => {
    // Admin và Staff có thể return tại bất kỳ station nào
    if (req.user.role === 'admin' || req.user.role === 'staff') {
        return next();
    }

    // Renter không được phép return
    if (req.user.role === 'renter') {
        return res.status(403).json({
            error: 'Renters are not allowed to perform return operations'
        });
    }

    next();
};
