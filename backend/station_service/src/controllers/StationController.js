import { StationModel } from "../models/StationModel.js";

export const StationController = {
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
      const { user_id, display_name, address, latitude, longitude, count_vehicle } = req.body;
      if (!user_id || !display_name || !address) {
        return res.status(400).json({ error: "user_id, display_name, address are required" });
      }
      const saved = await StationModel.upsert({ user_id, display_name, address, latitude, longitude, count_vehicle });
      res.status(201).json(saved);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  update: async (req, res) => {
    try {
      const { user_id } = req.params;
      const updated = await StationModel.update(user_id, req.body || {});
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
      const rows = await StationModel.listVehicles(user_id);
      res.json(rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  addVehicle: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { vehicle_id } = req.body;
      if (!vehicle_id) return res.status(400).json({ error: "vehicle_id is required" });
      const row = await StationModel.addVehicle(user_id, vehicle_id);
      if (!row) return res.status(200).json({ message: "Already exists" });
      res.status(201).json(row);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  removeVehicle: async (req, res) => {
    try {
      const { user_id, vehicle_id } = req.params;
      const ok = await StationModel.removeVehicle(user_id, vehicle_id);
      if (!ok) return res.status(404).json({ error: "Not found" });
      res.json({ message: "Deleted" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },
};


