import { RenterProfile, User } from "../libs/db.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await RenterProfile.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "phone_number", "role"],
        },
      ],
    });
    if (!profile) {
      return res.status(404).json({ message: "Renter profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error in getProfile", error);
    res.status(500).json({ message: "Internal Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await RenterProfile.findOne({ where: { id: id } });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { full_name, driver_license_url, national_id_url } = req.body;

    await profile.update({
      full_name: full_name || profile.full_name,
      driver_license_url: driver_license_url || profile.driver_license_url,
      national_id_url: national_id_url || profile.national_id_url,
      updated_at: new Date(),
    });
    res.status(200).json({ message: "Cập nhật hồ sơ thành công", profile });
  } catch (error) {
    console.error("Error in updateProfile", error);
    res.status(500).json({ message: "Internal Error" });
  }
};
