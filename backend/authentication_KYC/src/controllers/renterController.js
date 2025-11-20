import { RenterProfile, User } from "../libs/db.js";
import { Op } from "sequelize";

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
        {
          model: User,
          as: "verified_by_staff",
          attributes: ["id", "email"],
          required: false,
          include: [
            {
              model: RenterProfile,
              as: "renter_profile",
              attributes: ["full_name"],
              required: false,
            },
          ],
        },
      ],
    });
    if (!profile) {
      return res.status(404).json({ message: "Renter profile not found" });
    }

    const result = profile.toJSON();
    if (result.verified_by_staff_id && result.verified_by_staff) {
      // Lấy tên từ RenterProfile.full_name của staff, nếu không có thì fallback về email
      const staffProfile = result.verified_by_staff.renter_profile;
      if (staffProfile && staffProfile.full_name) {
        result.verified_by_staff_name = staffProfile.full_name;
      } else {
        // Fallback: lấy từ email
        const emailPrefix = result.verified_by_staff.email.split("@")[0];
        result.verified_by_staff_name = emailPrefix
          .replace(/[._-]/g, " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ") || emailPrefix;
      }
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProfile", error);
    res.status(500).json({ message: "Internal Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone_number, full_name } = req.body;

    const user = await User.findByPk(id, {
      include: [{ model: RenterProfile, as: "renter_profile" }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (existingEmailUser) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc số điện thoại đã tồn tại",
        });
      }
      user.email = email;
    }

    if (phone_number && phone_number !== user.phone_number) {
      const existingPhoneUser = await User.findOne({
        where: { phone_number, id: { [Op.ne]: id } },
      });
      if (existingPhoneUser) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc số điện thoại đã tồn tại",
        });
      }
      user.phone_number = phone_number;
    }

    if (full_name) {
      if (user.renter_profile) {
        user.renter_profile.full_name = full_name;
        await user.renter_profile.save();
      } else {
        await RenterProfile.create({
          id: user.id,
          full_name,
          verification_status: "pending",
          is_risky: false,
        });
      }
    }

    await user.save();

    return res.json({
      success: true,
      message: `Cập nhật thông tin thành công cho người thuê ${user.email}`,
      result: {
        id: user.id,
        email: user.email,
        phone: user.phone_number || "",
        full_name: user.renter_profile?.full_name || full_name || "",
        kycStatus: user.renter_profile?.verification_status || "pending",
        kycNote: user.renter_profile?.note || null,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin renter:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
