import { Op } from "sequelize";
import { RenterProfile, User } from "../libs/db.js";
import { registerUser } from "../services/auth.js";

export const createAccount = async (req, res) => {
  try {
    const { email, phone_number, password, role } = req.body;
    const user = await registerUser({
      email,
      phone_number,
      password,
      role,
    });
    return res.status(201).json({
      message: "Dăng ký thành công",
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    const message = error.message || "Internal Error";
    return res.status(status).json({ message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, q } = req.query;

    const where = {};

    if (role) where.role = role;

    if (q) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${q}%` } }, // iLike dùng trong PostgreSQL (case-insensitive)
        { phone_number: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      where,
      include: [
        {
          model: RenterProfile,
          as: "renter_profile",
          required: false,
        },
      ],
      attributes: {
        exclude: ["password_hash", "refreshtoken"],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      users: rows,
    });
  } catch (error) {
    console.error("Error when calling getAllUsers");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash", "refreshtoken"] },
      include: [
        {
          model: RenterProfile,
          as: "renter_profile",
          required: false,
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error when calling getUser");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone_number, full_name } = req.body;

    // Tìm user
    const user = await User.findByPk(id, {
      include: [{ model: RenterProfile, as: "renter_profile" }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Cập nhật email và số điện thoại nếu có
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    await user.save();

    // Nếu user là renter, cập nhật full_name trong RenterProfile
    if (user.role === "renter" && full_name) {
      if (user.renter_profile) {
        user.renter_profile.full_name = full_name;
        await user.renter_profile.save();
      } else {
        // Trường hợp profile chưa tồn tại (không thường xảy ra)
        await RenterProfile.create({
          id: user.id,
          full_name,
          verification_status: "pending",
          is_risky: false,
        });
      }
    }

    res.json({
      success: true,
      message: `Cập nhật thông tin thành công cho user ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        full_name: user.renter_profile?.full_name || null,
      },
    });
  } catch (error) {
    console.error("Error when calling updateUserProfile", error);
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = ["renter", "staff", "admin"];
    res.json({
      success: true,
      roles,
    });
  } catch (error) {
    console.error("Error when calling getAllRoles");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};
