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
    });
    if (!profile) throw new Error("Profile not found");

    return profile;
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

    return {
      data: rows,
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

    await profile.reload();
    return {
      id: profile.id,
      full_name: profile.full_name,
      verification_status: profile.verification_status,
      note_staff: profile.note,
      verified_by_staff_id: profile.verified_by_staff_id,
      updated_at: profile.updated_at,
    };
  },
};
