import { DataTypes } from "sequelize";

const createUserModel = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
        validate: {
          len: [8, 20],
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM({
          values: ["renter", "staff", "admin"],
          name: "user_role",
        }),
        allowNull: false,
        defaultValue: "renter",
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
      refreshtoken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: false,
      underscored: true,
    }
  );

  User.afterCreate(async (user, options) => {
    const RenterProfile = sequelize.models.RenterProfile;
    if (user.role === "renter") {
      const emailPrefix = user.email.split("@")[0];
      const formattedName = emailPrefix
        .replace(/[._-]/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      
      await RenterProfile.create({
        id: user.id,
        full_name: formattedName || emailPrefix,
        verification_status: "pending",
        is_risky: false,
      });
    }
  });

  return User;
};

export default createUserModel;
