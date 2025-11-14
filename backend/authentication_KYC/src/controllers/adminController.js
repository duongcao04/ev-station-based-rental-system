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
    const { page = 1, limit = 10, role, q, kycStatus } = req.query;

    const where = {};

    if (role) where.role = role;

    if (q) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${q}%` } },
        { phone_number: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const renterProfileWhere = {};

    if (kycStatus && role === "renter") {
      renterProfileWhere.verification_status = kycStatus;
    }

    const includeOptions = [
      {
        model: RenterProfile,
        as: "renter_profile",
        required: role === "renter",
        ...(Object.keys(renterProfileWhere).length > 0
          ? {
              where: renterProfileWhere,
            }
          : {}),
        include:
          role === "renter"
            ? [
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
              ]
            : [],
      },
    ];

    const { rows, count } = await User.findAndCountAll({
      where,
      include: includeOptions,
      attributes: {
        exclude: ["password_hash", "refreshtoken"],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    const normalizedUsers = rows.map((u) => {
      let verifiedByName = null;
      if (
        u.role === "renter" &&
        u.renter_profile?.verified_by_staff_id &&
        u.renter_profile?.verified_by_staff
      ) {
        const staffProfile = u.renter_profile.verified_by_staff.renter_profile;
        if (staffProfile && staffProfile.full_name) {
          verifiedByName = staffProfile.full_name;
        } else {
          const emailPrefix =
            u.renter_profile.verified_by_staff.email.split("@")[0];
          verifiedByName =
            emailPrefix
              .replace(/[._-]/g, " ")
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ") || emailPrefix;
        }
      }

      return {
        id: u.id,
        email: u.email,
        role: u.role,

        displayName: u.renter_profile?.full_name || null,
        phone: u.phone_number || "",

        kycStatus:
          u.role === "renter"
            ? u.renter_profile?.verification_status || "pending"
            : undefined,
        verifiedBy: verifiedByName || null,
        kycNote: u.renter_profile?.note || null,

        station: u.role === "staff" ? null : undefined,
      };
    });

    res.status(200).json({
      success: true,
      result: normalizedUsers,
      meta: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
      },
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
    const { email } = req.body;
    const phone_number = req.body.phone_number ?? req.body.phone;
    const full_name = req.body.full_name ?? req.body.displayName;

    // find user
    const user = await User.findByPk(id, {
      include: [{ model: RenterProfile, as: "renter_profile" }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // check email
    if (email) {
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

    // check phone number
    if (phone_number) {
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

    // save changes to User (email, phone, full_name)
    await user.save();

    // if user is staff, update station
    if (user.role === "staff" && req.body.station) {
      try {
        await StationService.update(user.id, {
          display_name: req.body.station,
        });
      } catch (e) {
        console.error("Failed to update staff station:", e?.message || e);
      }
    }

    // update full_name for renter
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

    res.json({
      success: true,
      message: `Cập nhật thông tin thành công cho user ${user.email}`,
      result: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone_number || "",
        displayName:
          user.role === "renter"
            ? user.renter_profile?.full_name || null
            : user.full_name || null,
        kycStatus:
          user.role === "renter"
            ? user.renter_profile?.verification_status || "pending"
            : undefined,
        verifiedBy: user.renter_profile?.verified_by_staff_id || null,
        kycNote: user.renter_profile?.note || null,
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
