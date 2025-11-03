import { DataTypes } from "sequelize";

const createRenterProfileModel = (sequelize) => {
  const RenterProfile = sequelize.define(
    "RenterProfile",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      driver_license_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      national_id_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verification_status: {
        type: DataTypes.ENUM({
          values: ["pending", "verified", "rejected"],
          name: "verification_status",
        }),
        allowNull: false,
        defaultValue: "pending",
      },
      verified_by_staff_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_risky: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "renter_profiles",
      timestamps: false,
      underscored: true,
    }
  );

  return RenterProfile;
};

export default createRenterProfileModel;
