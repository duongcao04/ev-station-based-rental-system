import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const authenticate = (req, res, next) => {
    try {
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
                role: decoded.role,
                station_id: decoded.station_id || null
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

export const checkOwnership = async (req, res, next) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            return next();
        }

        if (req.user.role === 'renter') {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Booking ID is required' });
            }

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

export const checkCheckinPermission = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user.role === 'admin') {
            return next();
        }

        if (req.user.role === 'staff') {
            const pool = (await import('../config/db.js')).default;
            const bookingResult = await pool.query(
                'SELECT start_station_id FROM bookings WHERE booking_id = $1',
                [id]
            );

            if (bookingResult.rows.length === 0) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            const booking = bookingResult.rows[0];
            const startStationId = booking.start_station_id;

            if (!startStationId) {
                return res.status(400).json({
                    error: 'Booking does not have a start station'
                });
            }

            let actualStationId = null;

            try {
                const stationCheck = await pool.query(
                    `SELECT station_id FROM stations WHERE station_id = $1 LIMIT 1`,
                    [startStationId]
                );

                if (stationCheck.rows.length > 0) {
                    actualStationId = stationCheck.rows[0].station_id;
                } else {
                    const stationByUserId = await pool.query(
                        `SELECT station_id FROM stations WHERE user_id = $1 LIMIT 1`,
                        [startStationId]
                    );

                    if (stationByUserId.rows.length > 0) {
                        actualStationId = stationByUserId.rows[0].station_id;
                    }
                }

            } catch (dbError) {

                try {
                    const axios = (await import('axios')).default;
                    const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
                    const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

                    try {
                        const stationResponse = await axios.get(
                            `${apiGatewayUrl}/api/v1/stations/by-id/${startStationId}`,
                            {
                                headers: {
                                    'Authorization': req.headers['authorization'] || '',
                                    'x-internal-secret': internalSecret
                                },
                                timeout: 5000
                            }
                        );
                        actualStationId = stationResponse.data?.station_id;
                    } catch (err) {
                        try {
                            const stationResponse = await axios.get(
                                `${apiGatewayUrl}/api/v1/stations/${startStationId}`,
                                {
                                    headers: {
                                        'Authorization': req.headers['authorization'] || '',
                                        'x-internal-secret': internalSecret
                                    },
                                    timeout: 5000
                                }
                            );
                            actualStationId = stationResponse.data?.station_id;
                        } catch (err2) {
                            console.error('[checkCheckinPermission] Failed to get station:', err2.message);
                        }
                    }

                } catch (apiError) {
                    console.error('[checkCheckinPermission] Station Service API call failed:', apiError.message);
                    return res.status(500).json({
                        error: 'Unable to verify station assignment',
                        message: 'Không thể xác thực quyền check-in. Vui lòng thử lại sau.'
                    });
                }
            }

            if (!actualStationId) {
                return res.status(400).json({
                    error: 'Unable to determine station_id for start station',
                    message: 'Không thể xác định trạm bắt đầu'
                });
            }

            const staffStationIds = [];
            let userStationId = null;

            try {
                const ownerQuery = `SELECT station_id FROM stations WHERE user_id = $1`;
                const ownerResult = await pool.query(ownerQuery, [req.user.id]);
                ownerResult.rows.forEach(row => {
                    if (row.station_id && !staffStationIds.includes(row.station_id)) {
                        staffStationIds.push(row.station_id);
                    }
                });

                try {
                    const userQuery = `SELECT station_id FROM users WHERE id = $1`;
                    const userResult = await pool.query(userQuery, [req.user.id]);
                    if (userResult.rows.length > 0 && userResult.rows[0].station_id) {
                        userStationId = userResult.rows[0].station_id;
                    }
                } catch (userDbError) {
                    // Different database
                }

            } catch (dbError) {

                try {
                    const axios = (await import('axios')).default;
                    const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
                    const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

                    const allStationsResponse = await axios.get(
                        `${apiGatewayUrl}/api/v1/stations`,
                        {
                            headers: {
                                'Authorization': req.headers['authorization'] || '',
                                'x-internal-secret': internalSecret
                            },
                            timeout: 5000
                        }
                    );

                    const allStations = Array.isArray(allStationsResponse.data) ? allStationsResponse.data : [];

                    for (const station of allStations) {
                        if (station.user_id === req.user.id) {
                            if (station.station_id && !staffStationIds.includes(station.station_id)) {
                                staffStationIds.push(station.station_id);
                            }
                        }
                    }

                } catch (apiError) {
                    console.error('[checkCheckinPermission] Station Service API call failed:', apiError.message);
                    return res.status(500).json({
                        error: 'Unable to verify station assignment',
                        message: 'Không thể xác thực quyền check-in. Vui lòng thử lại sau.'
                    });
                }
            }

            if (!userStationId) {
                try {
                    const axios = (await import('axios')).default;
                    const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
                    const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

                    const userInfoRes = await axios.get(
                        `${apiGatewayUrl}/api/v1/admin/users/${req.user.id}`,
                        {
                            headers: {
                                'Authorization': req.headers['authorization'] || '',
                                'x-internal-secret': internalSecret
                            },
                            timeout: 3000
                        }
                    );

                    if (userInfoRes.data?.success && userInfoRes.data?.user?.station_id) {
                        userStationId = userInfoRes.data.user.station_id;
                    }
                } catch (authErr) {
                    // Ignore
                }
            }

            if (userStationId) {
                try {
                    let actualUserStationId = userStationId;

                    try {
                        const resolveQuery = `SELECT station_id FROM stations WHERE station_id = $1 OR user_id = $1 LIMIT 1`;
                        const resolveResult = await pool.query(resolveQuery, [userStationId]);
                        if (resolveResult.rows.length > 0) {
                            actualUserStationId = resolveResult.rows[0].station_id || userStationId;
                        }
                    } catch (resolveDbError) {
                        try {
                            const axios = (await import('axios')).default;
                            const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
                            const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

                            try {
                                const stationRes = await axios.get(
                                    `${apiGatewayUrl}/api/v1/stations/by-id/${userStationId}`,
                                    {
                                        headers: { 'x-internal-secret': internalSecret },
                                        timeout: 3000
                                    }
                                );
                                actualUserStationId = stationRes.data?.station_id || userStationId;
                            } catch (err) {
                                try {
                                    const stationByUserRes = await axios.get(
                                        `${apiGatewayUrl}/api/v1/stations/${userStationId}`,
                                        {
                                            headers: { 'x-internal-secret': internalSecret },
                                            timeout: 3000
                                        }
                                    );
                                    actualUserStationId = stationByUserRes.data?.station_id || userStationId;
                                } catch (err2) {
                                    // Ignore
                                }
                            }
                        } catch (apiErr) {
                            // Ignore
                        }
                    }

                    if (!staffStationIds.includes(actualUserStationId)) {
                        staffStationIds.push(actualUserStationId);
                    }
                    if (actualUserStationId !== userStationId && !staffStationIds.includes(userStationId)) {
                        staffStationIds.push(userStationId);
                    }
                } catch (err) {
                    if (!staffStationIds.includes(userStationId)) {
                        staffStationIds.push(userStationId);
                    }
                }
            }

            if (!staffStationIds.includes(actualStationId)) {
                return res.status(403).json({
                    error: 'Staff can only check-in bookings at their assigned station',
                    message: 'Bạn chỉ có thể check-in xe tại trạm được phân công của mình',
                    required_station_id: actualStationId,
                    staff_station_ids: staffStationIds,
                    staff_id: req.user.id
                });
            }
        }

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

export const checkReturnPermission = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'staff') {
        return next();
    }

    if (req.user.role === 'renter') {
        return res.status(403).json({
            error: 'Renters are not allowed to perform return operations'
        });
    }

    next();
};

export const verifyInternalRequest = (req, res, next) => {
    try {
        const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';
        const providedSecret = req.headers['x-internal-secret'];

        if (!providedSecret) {
            return res.status(401).json({
                error: 'Internal request requires x-internal-secret header'
            });
        }

        if (providedSecret !== internalSecret) {
            return res.status(403).json({
                error: 'Invalid internal secret'
            });
        }

        req.isInternal = true;
        next();
    } catch (error) {
        console.error('verifyInternalRequest error:', error);
        return res.status(500).json({ error: 'Internal verification failed' });
    }
};