// Authentication & Authorization Middleware
import jwt from 'jsonwebtoken';

// Mock user data (trong thực tế sẽ lấy từ Auth Service)
const mockUsers = {
    1001: { id: 1001, role: 'renter', name: 'John Doe' },
    1002: { id: 1002, role: 'staff', name: 'Jane Staff', station_id: 'station-001' },
    1003: { id: 1003, role: 'admin', name: 'Admin User' },
    1004: { id: 1004, role: 'staff', name: 'Bob Staff', station_id: 'station-002' }
};

// Middleware để verify token và set user info
export const authenticate = (req, res, next) => {
    try {
        // Trong thực tế sẽ verify JWT token từ Auth Service
        // const token = req.headers.authorization?.split(' ')[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Mock: Lấy user_id từ header (trong thực tế sẽ từ JWT)
        const user_id = req.headers['x-user-id'];

        // Convert to number if it's a string
        const userIdNum = typeof user_id === 'string' ? parseInt(user_id, 10) : user_id;

        if (!user_id || isNaN(userIdNum)) {
            return res.status(401).json({ error: 'Authentication required', received: user_id });
        }

        const user = mockUsers[userIdNum] || mockUsers[String(userIdNum)];
        if (!user) {
            return res.status(401).json({ error: 'Invalid user', user_id: userIdNum, available: Object.keys(mockUsers) });
        }

        // Attach user info to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid token', details: error.message });
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
        if (req.user.role === 'staff') {
            // Lấy thông tin booking để kiểm tra start_station_id
            const pool = (await import('../config/db.js')).default;
            const { rows } = await pool.query(
                'SELECT start_station_id FROM bookings WHERE booking_id = $1',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = rows[0];
            if (booking.start_station_id !== req.user.station_id) {
                return res.status(403).json({
                    error: 'Staff can only check-in at their assigned station',
                    required_station: booking.start_station_id,
                    staff_station: req.user.station_id
                });
            }
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
