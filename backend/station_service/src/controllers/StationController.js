import { StationModel } from "../models/StationModel.js";
import { getVehicleInfo, validateVehicle } from "../utils/vehicleService.js";

const findStationByUserIdOr404 = async (user_id, res) => {
  const station = await StationModel.getByUserId(user_id);
  if (!station) {
    res.status(404).json({ error: "Station not found" });
    return null;
  }
  return station;
};

const findStationByIdOr404 = async (station_id, res) => {
  const station = await StationModel.getById(station_id);
  if (!station) {
    res.status(404).json({ error: "Station not found" });
    return null;
  }
  return station;
};

export const StationController = {
  listStaff: async (req, res) => {
    try {
      const { station_id } = req.params;
      const station = await findStationByIdOr404(station_id, res);
      if (!station) return;

      const staff = await StationModel.listStaff(station.station_id);
      res.json({ station, staff });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  addStaff: async (req, res) => {
    try {
      const { station_id } = req.params;
      const { staff_user_id, role = "staff" } = req.body || {};

      if (!staff_user_id) {
        return res.status(400).json({ error: "staff_user_id is required" });
      }
      if (!["staff", "manager"].includes(role)) {
        return res
          .status(400)
          .json({ error: "Invalid role", allowed: ["staff", "manager"] });
      }

      const station = await findStationByIdOr404(station_id, res);
      if (!station) return;

      const added = await StationModel.addStaff(
        station.station_id,
        staff_user_id,
        role
      );
      res.status(201).json(added);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  removeStaff: async (req, res) => {
    try {
      const { station_id, staff_user_id } = req.params;
      const station = await findStationByIdOr404(station_id, res);
      if (!station) return;

      const removed = await StationModel.removeStaff(
        station.station_id,
        staff_user_id
      );
      if (!removed) {
        return res
          .status(404)
          .json({ error: "Staff not found in station" });
      }

      res.json({ message: "Removed" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  list: async (req, res) => {
    try {
      const rows = await StationModel.listAll();
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  getByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;
      const row = await StationModel.getByUserId(user_id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  upsert: async (req, res) => {
    try {
      const { station_id, user_id, display_name, address, latitude, longitude, count_vehicle } = req.body;
      if (!user_id || !display_name || !address) {
        return res.status(400).json({ error: "user_id, display_name, address are required" });
      }
      const saved = await StationModel.upsert({ station_id, user_id, display_name, address, latitude, longitude, count_vehicle });
      res.status(201).json(saved);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  update: async (req, res) => {
    try {
      const { user_id } = req.params;
      const updated = await StationModel.updateByUserId(user_id, req.body || {});
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  listVehicles: async (req, res) => {
    try {
      const { user_id } = req.params;
      const station = await findStationByUserIdOr404(user_id, res);
      if (!station) return;

      const stationVehicles = await StationModel.listVehicles(station.station_id);

      const vehiclesWithInfo = await Promise.all(
        stationVehicles.map(async (sv) => {
          try {
            const vehicleInfo = await getVehicleInfo(sv.vehicle_id);
            return {
              ...sv,
              vehicle: vehicleInfo,
            };
          } catch (error) {
            return {
              ...sv,
              vehicle: null,
              error: "Could not fetch vehicle info",
            };
          }
        })
      );

      res.json(vehiclesWithInfo);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  addVehicle: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { vehicle_id, status, battery_soc, note } = req.body;
      if (!vehicle_id) return res.status(400).json({ error: "vehicle_id is required" });

      const station = await findStationByUserIdOr404(user_id, res);
      if (!station) return;

      const validation = await validateVehicle(vehicle_id);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error || "Vehicle not found",
          vehicle_id,
        });
      }

      const row = await StationModel.addVehicle(station.station_id, vehicle_id, { status, battery_soc, note });
      if (!row) return res.status(200).json({ message: "Already exists" });

      await StationModel.updateVehicleCount(station.station_id);

      res.status(201).json(row);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  removeVehicle: async (req, res) => {
    try {
      const { user_id, vehicle_id } = req.params;
      const station = await findStationByUserIdOr404(user_id, res);
      if (!station) return;

      const ok = await StationModel.removeVehicle(station.station_id, vehicle_id);
      if (!ok) return res.status(404).json({ error: "Not found" });

      await StationModel.updateVehicleCount(station.station_id);

      res.json({ message: "Deleted" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  updateVehicleStatus: async (req, res) => {
    try {
      const { user_id, vehicle_id } = req.params;
      const { status, battery_soc, note } = req.body;

      const station = await findStationByUserIdOr404(user_id, res);
      if (!station) return;

      const updated = await StationModel.updateVehicleStatus(station.station_id, vehicle_id, {
        status,
        battery_soc,
        note,
      });

      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  getStationsByVehicleId: async (req, res) => {
    try {
      const { vehicle_id } = req.params;
      const stations = await StationModel.getStationsByVehicleId(vehicle_id);
      res.json(stations);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  deleteStation: async (req, res) => {
    try {
      const { user_id } = req.params;

      const station = await StationModel.getByUserId(user_id);
      if (!station) {
        return res.status(404).json({ error: "Station not found" });
      }

      const deleted = await StationModel.deleteByUserId(user_id);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete station" });
      }

      res.json({ message: "Station deleted", station: deleted });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },
};


