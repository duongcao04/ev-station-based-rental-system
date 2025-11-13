const getStationServiceUrl = () => {
  // Ưu tiên dùng API Gateway nếu có, nếu không thì gọi trực tiếp station service
  if (process.env.USE_API_GATEWAY === "true" && process.env.API_GATEWAY_URL) {
    return process.env.API_GATEWAY_URL;
  }
  return (
    process.env.API_GATEWAY_PORT ||
    process.env.STATION_SERVICE_URL ||
    "http://localhost:6000"
  );
};

export const StationService = {
  /**
   * Lấy station theo user_id từ Station Service
   * @param {string} user_id - ID của user
   * @returns {Promise<{id: string} | null>} Station object hoặc null nếu không tìm thấy
   */
  async getByUserId(user_id) {
    try {
      const baseUrl = getStationServiceUrl();
      // Nếu dùng API Gateway, path sẽ là /api/v1/stations/:user_id
      // Nếu gọi trực tiếp, path cũng là /api/v1/stations/:user_id
      const url = `${baseUrl}/api/v1/stations/${user_id}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(
          `Station service error: ${response.status} ${response.statusText}`
        );
      }

      const station = await response.json();
      return station;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Station service request timeout");
      } else {
        console.error("Error calling station service:", error.message);
      }
      return null;
    }
  },

  /**
   * Cập nhật station theo user_id (chỉ các trường cung cấp)
   */
  async update(user_id, payload) {
    try {
      const baseUrl = getStationServiceUrl();
      const url = `${baseUrl}/api/v1/stations/${user_id}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload || {}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Station service update error: ${response.status} ${response.statusText}`
        );
      }

      const updated = await response.json();
      return updated;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Station service request timeout");
      } else {
        console.error("Error updating station service:", error.message);
      }
      return null;
    }
  },
};
