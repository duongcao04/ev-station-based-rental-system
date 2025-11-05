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

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["renter", "staff", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ. Phải là 'renter', 'staff' hoặc 'admin'",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `Cập nhật role thành công cho user ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error when calling updateUserRole");
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
