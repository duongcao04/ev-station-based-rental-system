import { Model, Op } from "sequelize";
import { RenterProfile, User } from "../libs/db.js";

export const KYCService = {
  async updateKYC(userId, files) {
    //finding profile
    const profile = await RenterProfile.findOne({ where: { id: userId } });
    if (!profile) {
      throw new Error("Profile not found");
    }

    //Get files from multer
    const driver_license_file = files?.driver_license?.[0];
    const national_id_file = files?.national_id?.[0];

    //Create URL link to save in db
    const driver_license_url = driver_license_file
      ? `/upload/kyc/${driver_license_file.filename}`
      : profile.driver_license_url;
    const national_id_url = national_id_file
      ? `/upload/kyc/${national_id_file.filename}`
      : profile.national_id_url;

    //update db
    const updateData = {
      driver_license_url,
      national_id_url,
      verification_status: "pending",
      updated_at: new Date(),
    };
    await profile.update(updateData);
    
    // Reload to get fresh data
    await profile.reload();

    return profile;
  },

  async getKYCStatus(userId) {
    const profile = await RenterProfile.findOne({
      where: { id: userId },
      attributes: [
        "driver_license_url",
        "national_id_url",
        "verification_status",
        "verified_by_staff_id",
        "note",
        "updated_at",
      ],
      include: [
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
    if (!profile) throw new Error("Profile not found");

    const result = profile.toJSON();
    if (result.verified_by_staff_id && result.verified_by_staff) {
      const staffProfile = result.verified_by_staff.renter_profile;
      if (staffProfile && staffProfile.full_name) {
        result.verified_by_staff_name = staffProfile.full_name;
      } else {
        const emailPrefix = result.verified_by_staff.email.split("@")[0];
        result.verified_by_staff_name = emailPrefix
          .replace(/[._-]/g, " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ") || emailPrefix;
      }
    }

    return result;
  },

  async getKYCSubmissions({ status, page, q }) {
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereProfile = {};
    if (status) whereProfile.verification_status = status;
    if (q) {
      whereProfile[Op.or] = [{ full_name: { [Op.like]: `%${q}%` } }];
    }

    const whereUser = { role: "renter" };
    if (q) {
      whereUser[Op.or] = [
        { email: { [Op.like]: `%${q}%` } },
        { phone_number: { [Op.like]: `%${q}%` } },
      ];
    }

    const { rows, count } = await RenterProfile.findAndCountAll({
      where: whereProfile,
      limit,
      offset,
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["email", "phone_number", "role"],
          where: Object.keys(whereUser).length ? whereUser : undefined,
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
      attributes: [
        "id",
        "full_name",
        "driver_license_url",
        "national_id_url",
        "verification_status",
        "verified_by_staff_id",
        "note",
        "updated_at",
      ],
    });


    const formattedRows = rows.map((row) => {
      const result = row.toJSON();
      if (result.verified_by_staff_id && result.verified_by_staff) {
        const staffProfile = result.verified_by_staff.renter_profile;
        if (staffProfile && staffProfile.full_name) {
          result.verified_by_staff_name = staffProfile.full_name;
        } else {
          const emailPrefix = result.verified_by_staff.email.split("@")[0];
          result.verified_by_staff_name = emailPrefix
            .replace(/[._-]/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ") || emailPrefix;
        }
      }
      return result;
    });

    return {
      data: formattedRows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
    };
  },

  async verifyKYCSubmisstion({ submissionId, status, note_staff, staffId }) {
    const profile = await RenterProfile.findByPk(submissionId);
    if (!profile) throw new Error("KYC submission not found");

    const staff = await User.findByPk(staffId);
    if (!staff) throw new Error("Staff not found");

    if (!["staff", "admin"].includes(staff.role)) {
      throw new Error("No access KYC verification");
    }

    if (!["verified", "rejected"].includes(status)) {
      throw new Error("Invalid status value");
    }

    await profile.update({
      verification_status: status,
      note: note_staff,
      verified_by_staff_id: staffId,
      updated_at: new Date(),
    });

    await profile.reload({
      include: [
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

    // Format response với tên staff
    const result = profile.toJSON();
    if (result.verified_by_staff_id && result.verified_by_staff) {
      
      const staffProfile = result.verified_by_staff.renter_profile;
      if (staffProfile && staffProfile.full_name) {
        result.verified_by_staff_name = staffProfile.full_name;
      } else {
        const emailPrefix = result.verified_by_staff.email.split("@")[0];
        result.verified_by_staff_name = emailPrefix
          .replace(/[._-]/g, " ")
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ") || emailPrefix;
      }
    }

    return {
      id: result.id,
      full_name: result.full_name,
      verification_status: result.verification_status,
      note_staff: result.note,
      verified_by_staff_id: result.verified_by_staff_id,
      verified_by_staff_name: result.verified_by_staff_name || null,
      updated_at: result.updated_at,
    };
  },
};
