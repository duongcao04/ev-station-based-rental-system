import pool from "../config/db.js";
import { BookingModel } from "../models/BookingModel.js";

// POST /v1/api/bookings
export const createBooking = async (req, res) => {
  try {
    const { vehicle_id, payment_id, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details } = req.body;
    const user_id = req.user?.id;

    if (!vehicle_id || !start_station_id || !end_station_id || !start_date || !end_date || !total_amount) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: {
          vehicle_id: !vehicle_id,
          start_station_id: !start_station_id,
          end_station_id: !end_station_id,
          start_date: !start_date,
          end_date: !end_date,
          total_amount: !total_amount
        }
      });
    }

    // Validate total_amount is positive number
    const totalAmountNum = Number(total_amount);
    if (isNaN(totalAmountNum) || totalAmountNum <= 0) {
      return res.status(400).json({ error: "total_amount must be a positive number", received: total_amount });
    }

    // Validate date format
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format", start_date, end_date });
    }

    // Validate start_date < end_date (cho phép cùng ngày nhưng end_date phải sau start_date về thời gian)
    if (startDate >= endDate) {
      return res.status(400).json({
        error: "end_date must be after start_date",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        message: "End date must be at least 1 second after start date"
      });
    }

    const booking = await BookingModel.create({
      user_id,
      vehicle_id,
      payment_id,
      start_station_id,
      end_station_id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_amount: totalAmountNum,
      calculated_price_details: calculated_price_details || null,
    });

    res.status(201).json(booking);
  } catch (e) {
    console.error(' Create booking error:', e);

    if (e.code && e.code.startsWith("23")) {
      return res.status(409).json({ error: "Vehicle time overlap or constraint violation", details: e.message });
    }

    // Database constraint errors
    if (e.code === '23503') {
      return res.status(400).json({ error: "Invalid reference (vehicle_id, station_id, etc.)", details: e.message });
    }

    res.status(500).json({ error: "Server error", details: e.message, code: e.code });
  }
};

// PUT /v1/api/bookings/:id/checkin
export const checkin = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBooking = await BookingModel.getById(id);
    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existingBooking.status !== 'booked') {
      return res.status(400).json({
        error: "Booking cannot be checked in",
        current_status: existingBooking.status,
        required_status: "booked"
      });
    }

    const booking = await BookingModel.checkin({ booking_id: id });
    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /v1/api/bookings/:id/return
export const returnVehicle = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing. Please send JSON data." });
    }

    const { actual_return_date, actual_return_station_id, penalty_fee } = req.body;

    if (!actual_return_date) {
      return res.status(400).json({ error: "actual_return_date is required" });
    }

    if (!actual_return_station_id) {
      return res.status(400).json({ error: "actual_return_station_id is required" });
    }

    if (penalty_fee !== undefined && (isNaN(penalty_fee) || penalty_fee < 0)) {
      return res.status(400).json({ error: "penalty_fee must be a non-negative number" });
    }

    const current = await BookingModel.getById(id);
    if (!current) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (current.status !== "ongoing") {
      return res.status(400).json({ error: "Booking must be ongoing to return" });
    }

    const totalPenalty = Number(penalty_fee) || 0;
    const depositAmount = current.calculated_price_details?.deposit || current.deposit_amount || 0;

    let refundAmount = 0;
    let finalAmount = current.total_amount;

    if (depositAmount > 0) {
      if (totalPenalty === 0) {
        refundAmount = depositAmount;
      } else if (totalPenalty < depositAmount) {
        refundAmount = depositAmount - totalPenalty;
      } else {
        refundAmount = 0;
        const additionalFee = totalPenalty - depositAmount;
        finalAmount = current.total_amount + additionalFee;
      }
    }

    await client.query("BEGIN");
    const updated = await BookingModel.returnVehicle(client, {
      booking_id: id,
      actual_return_date,
      actual_return_station_id,
      final_amount: finalAmount,
      late_fee: totalPenalty,
      refund_amount: refundAmount,
    });
    await client.query("COMMIT");

    res.json({
      booking: updated,
      breakdown: {
        deposit_amount: depositAmount,
        penalty_fee: totalPenalty,
        refund_amount: refundAmount,
        final_amount: finalAmount,
        additional_payment_required: totalPenalty > depositAmount ? totalPenalty - depositAmount : 0
      }
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error('Return error:', e);
    res.status(500).json({ error: "Server error", details: e.message });
  } finally {
    client.release();
  }
};

// GET /v1/api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const booking = await BookingModel.getById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /v1/api/bookings/me/history
export const myBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = await BookingModel.listMine(user_id);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /v1/api/bookings/all
export const getAllBookings = async (req, res) => {
  try {
    const { status, station_id, limit = 50, offset = 0 } = req.query;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let query = 'SELECT * FROM bookings';
    const params = [];
    const conditions = [];

    if (userRole === 'staff' && userId) {
      const staffStationIds = [];
      let useDirectQuery = true;
      let userStationId = null;

      try {
        const ownerQuery = `SELECT station_id FROM stations WHERE user_id = $1`;
        const ownerResult = await pool.query(ownerQuery, [userId]);
        ownerResult.rows.forEach(row => {
          if (row.station_id && !staffStationIds.includes(row.station_id)) {
            staffStationIds.push(row.station_id);
          }
        });

        try {
          const userQuery = `SELECT station_id FROM users WHERE id = $1`;
          const userResult = await pool.query(userQuery, [userId]);
          if (userResult.rows.length > 0 && userResult.rows[0].station_id) {
            userStationId = userResult.rows[0].station_id;
          }
        } catch (userDbError) {
          // Different database
        }
      } catch (dbError) {
        useDirectQuery = false;
      }

      if (staffStationIds.length === 0 || !useDirectQuery) {
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

          if (!useDirectQuery) {
            staffStationIds.length = 0;
          }

          for (const station of allStations) {
            if (station.user_id === userId) {
              if (station.station_id && !staffStationIds.includes(station.station_id)) {
                staffStationIds.push(station.station_id);
              }
            }
          }

          if (!userStationId) {
            try {
              const authInternalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';
              const userInfoRes = await axios.get(
                `${apiGatewayUrl}/api/v1/admin/users/${userId}`,
                {
                  headers: {
                    'Authorization': req.headers['authorization'] || '',
                    'x-internal-secret': authInternalSecret
                  },
                  timeout: 3000
                }
              );

              if (userInfoRes.data?.user?.station_id) {
                userStationId = userInfoRes.data.user.station_id;
              } else if (userInfoRes.data?.result?.station_id) {
                userStationId = userInfoRes.data.result.station_id;
              }
            } catch (authErr) {
              // Ignore
            }
          }

        } catch (apiError) {
          console.error('[getAllBookings] Station Service API call failed:', apiError.message);
          return res.json([]);
        }
      }

      if (!userStationId) {
        try {
          const axios = (await import('axios')).default;
          const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
          const userInfoRes = await axios.get(
            `${apiGatewayUrl}/api/v1/auth/my-station-id`,
            {
              headers: {
                'Authorization': req.headers['authorization'] || '',
                'Cookie': req.headers['cookie'] || '',
              },
              timeout: 3000
            }
          );

          if (userInfoRes.data?.user?.station_id) {
            userStationId = userInfoRes.data.user.station_id;
          }
        } catch (authErr) {
          // Ignore
        }
      }

      if (staffStationIds.length === 0 && !userStationId) {
        return res.json([]);
      }

      const matchedStationIds = [...staffStationIds];
      const matchedUserIds = [];

      if (userStationId) {
        if (!matchedStationIds.includes(userStationId)) {
          matchedStationIds.push(userStationId);
        }
        if (!matchedUserIds.includes(userStationId)) {
          matchedUserIds.push(userStationId);
        }

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

          if (!matchedStationIds.includes(actualUserStationId)) {
            matchedStationIds.push(actualUserStationId);
          }
          if (!matchedUserIds.includes(userStationId)) {
            matchedUserIds.push(userStationId);
          }
          if (actualUserStationId !== userStationId && !matchedStationIds.includes(userStationId)) {
            matchedStationIds.push(userStationId);
          }
        } catch (err) {
          if (!matchedStationIds.includes(userStationId)) {
            matchedStationIds.push(userStationId);
          }
          if (!matchedUserIds.includes(userStationId)) {
            matchedUserIds.push(userStationId);
          }
        }
      }

      try {
        const allStationIdsForUserIdQuery = [...staffStationIds];
        if (userStationId && !allStationIdsForUserIdQuery.includes(userStationId)) {
          allStationIdsForUserIdQuery.push(userStationId);
        }

        if (allStationIdsForUserIdQuery.length > 0) {
          const userIdQuery = `SELECT station_id, user_id FROM stations WHERE station_id = ANY($1::uuid[]) OR user_id = ANY($1::uuid[])`;
          const userIdResult = await pool.query(userIdQuery, [allStationIdsForUserIdQuery]);
          userIdResult.rows.forEach(row => {
            if (row.station_id && !matchedStationIds.includes(row.station_id)) {
              matchedStationIds.push(row.station_id);
            }
            if (row.user_id && !matchedUserIds.includes(row.user_id)) {
              matchedUserIds.push(row.user_id);
            }
          });
        }
      } catch (dbError) {
        try {
          const axios = (await import('axios')).default;
          const apiGatewayUrl = process.env.API_GATEWAY_URL || 'http://localhost:8000';
          const internalSecret = process.env.INTERNAL_SERVICE_SECRET || 'internal-secret-key-change-in-production';

          const allStationIdsForApi = [...staffStationIds];
          if (userStationId && !allStationIdsForApi.includes(userStationId)) {
            allStationIdsForApi.push(userStationId);
          }

          for (const stationId of allStationIdsForApi) {
            try {
              let stationData = null;
              try {
                const stationResponse = await axios.get(
                  `${apiGatewayUrl}/api/v1/stations/by-id/${stationId}`,
                  {
                    headers: {
                      'Authorization': req.headers['authorization'] || '',
                      'x-internal-secret': internalSecret
                    },
                    timeout: 3000
                  }
                );
                stationData = stationResponse.data;
              } catch (err1) {
                try {
                  const stationByUserResponse = await axios.get(
                    `${apiGatewayUrl}/api/v1/stations/${stationId}`,
                    {
                      headers: {
                        'Authorization': req.headers['authorization'] || '',
                        'x-internal-secret': internalSecret
                      },
                      timeout: 3000
                    }
                  );
                  stationData = stationByUserResponse.data;
                } catch (err2) {
                  // Ignore
                }
              }

              if (stationData) {
                if (stationData.station_id && !matchedStationIds.includes(stationData.station_id)) {
                  matchedStationIds.push(stationData.station_id);
                }
                if (stationData.user_id && !matchedUserIds.includes(stationData.user_id)) {
                  matchedUserIds.push(stationData.user_id);
                }
              }
            } catch (err) {
              // Ignore
            }
          }
        } catch (apiError) {
          // Ignore
        }
      }

      const allStationIds = [...matchedStationIds, ...matchedUserIds];

      if (allStationIds.length > 0) {
        const stationConditions = allStationIds.map((_, index) =>
          `start_station_id = $${params.length + index + 1}`
        ).join(' OR ');

        conditions.push(`(${stationConditions})`);
        params.push(...allStationIds);
      } else {
        return res.json([]);
      }
    }

    if (userRole === 'admin' && station_id) {
      conditions.push(`(start_station_id = $${params.length + 1} OR end_station_id = $${params.length + 1})`);
      params.push(station_id);
    }

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await pool.query(query, params);

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
// PUT /v1/api/bookings/internal/:id/payment
export const updateBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_id } = req.body;
    if (!payment_id) return res.status(400).json({ error: "payment_id is required" });

    const existing = await BookingModel.getById(id);
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const updated = await BookingModel.updatePaymentId({ booking_id: id, payment_id });
    return res.json({ booking: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
// PUT /v1/api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { penalty_fee } = req.body;

    const booking = await BookingModel.getById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status !== "booked" && booking.status !== "ongoing") {
      return res.status(400).json({ error: "Only booked or ongoing bookings can be cancelled" });
    }

    if (penalty_fee !== undefined && (isNaN(penalty_fee) || penalty_fee < 0)) {
      return res.status(400).json({ error: "penalty_fee must be a non-negative number" });
    }

    const depositAmount = booking.calculated_price_details?.deposit || booking.deposit_amount || 0;
    const totalAmount = Number(booking.total_amount) || 0;

    let refundAmount = 0;
    let lateFee = 0;
    let additionalPaymentRequired = 0;

    if (booking.status === "booked") {
      if (totalAmount > 0) {
        refundAmount = totalAmount;
      }
      lateFee = 0;
    } else if (booking.status === "ongoing") {
      const totalPenalty = Number(penalty_fee) || 0;
      lateFee = totalPenalty;

      if (depositAmount > 0) {
        if (totalPenalty === 0) {
          refundAmount = depositAmount;
        } else if (totalPenalty < depositAmount) {
          refundAmount = depositAmount - totalPenalty;
        } else {
          refundAmount = 0;
          additionalPaymentRequired = totalPenalty - depositAmount;
        }
      } else {
        if (totalPenalty > 0) {
          additionalPaymentRequired = totalPenalty;
        }
      }
    }
    const cancelled = await BookingModel.cancel(id, { refund_amount: refundAmount, late_fee: lateFee });
    if (!cancelled) {
      return res.status(400).json({ error: "Cancel failed (state changed or booking not found)" });
    }

    return res.json({
      message: "Booking cancelled successfully",
      booking: cancelled,
      breakdown: {
        total_amount: totalAmount,
        deposit_amount: depositAmount,
        penalty_fee: lateFee,
        refund_amount: refundAmount,
        additional_payment_required: additionalPaymentRequired
      }
    });
  } catch (e) {
    console.error("cancelBooking error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

