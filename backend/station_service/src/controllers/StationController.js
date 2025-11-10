import { StationModel } from "../models/StationModel.js";
import { getVehicleInfo, validateVehicle } from "../utils/vehicleService.js";

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

  // Seed sample stations (chỉ dùng trong development)
  seedSampleStations: async (req, res) => {
    try {
      const sampleStations = [
        {
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          display_name: 'Ga Hà Nội',
          address: 'Số 1 Lê Duẩn, Hoàn Kiếm, Hà Nội',
          latitude: '21.0285',
          longitude: '105.8542',
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          display_name: 'Ga TP.HCM',
          address: 'Số 1 Nguyễn Thông, Quận 3, TP.HCM',
          latitude: '10.7769',
          longitude: '106.7009',
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          display_name: 'Ga Đà Nẵng',
          address: 'Số 1 Hải Phòng, Hải Châu, Đà Nẵng',
          latitude: '16.0544',
          longitude: '108.2022',
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440004',
          display_name: 'Ga Nha Trang',
          address: 'Số 1 Trần Phú, Nha Trang, Khánh Hòa',
          latitude: '12.2388',
          longitude: '109.1967',
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440005',
          display_name: 'Ga Huế',
          address: 'Số 1 Lê Lợi, Thành phố Huế, Thừa Thiên Huế',
          latitude: '16.4637',
          longitude: '107.5909',
        },
      ];

      const created = [];
      for (const station of sampleStations) {
        try {
          const saved = await StationModel.upsert(station);
          created.push(saved);
        } catch (error) {
          console.error(`Error creating station ${station.display_name}:`, error.message);
        }
      }

      res.json({
        message: `Đã tạo/cập nhật ${created.length} stations`,
        stations: created,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error", details: e.message });
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
      const stationVehicles = await StationModel.listVehicles(user_id);

      // Lấy vehicle info từ Vehicle Service cho mỗi vehicle
      const vehiclesWithInfo = await Promise.all(
        stationVehicles.map(async (sv) => {
          try {
            const vehicleInfo = await getVehicleInfo(sv.vehicle_id);
            return {
              ...sv,
              vehicle: vehicleInfo,  // Thêm vehicle info từ Vehicle Service
            };
          } catch (error) {
            // Nếu không lấy được vehicle info, vẫn trả về station_vehicle data
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

      // Validate vehicle_id với Vehicle Service
      const validation = await validateVehicle(vehicle_id);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error || "Vehicle not found",
          vehicle_id
        });
      }

      // Thêm vehicle vào station
      const row = await StationModel.addVehicle(user_id, vehicle_id, { status, battery_soc, note });
      if (!row) return res.status(200).json({ message: "Already exists" });

      // Update count_vehicle cho station
      await StationModel.updateVehicleCount(user_id);

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

      // Update count_vehicle cho station
      await StationModel.updateVehicleCount(user_id);

      res.json({ message: "Deleted" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Server error" });
    }
  },

  // Update vehicle status trong station
  updateVehicleStatus: async (req, res) => {
    try {
      const { user_id, vehicle_id } = req.params;
      const { status, battery_soc, note } = req.body;

      const updated = await StationModel.updateVehicleStatus(user_id, vehicle_id, {
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

  // Lấy stations chứa vehicle (query ngược)
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
};


