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
