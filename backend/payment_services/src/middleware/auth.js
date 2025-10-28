

// Mock user data (trong thực tế sẽ lấy từ Auth Service)
const mockUsers = {
    1001: { id: 1001, role: 'renter', name: 'John Doe' },
    1002: { id: 1002, role: 'staff', name: 'Jane Staff', station_id: 'station-001' },
    1003: { id: 1003, role: 'admin', name: 'Admin User' }
};

export const authenticate = (req, res, next) => {
    try {
        // Mock: Lấy user_id từ header (trong thực tế sẽ từ JWT)
        const user_id = req.headers['x-user-id'];

        if (!user_id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = mockUsers[user_id];
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
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
