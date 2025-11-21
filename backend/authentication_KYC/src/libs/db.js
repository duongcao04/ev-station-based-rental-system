import { Sequelize } from "sequelize";
import createUserModel from "../models/User.js";
import createRenterProfileModel from "../models/RenterProfile.js";
let User = null;
let RenterProfile = null;
let sequelize;

export const connectDB = async (database, username, password) => {
  // Validate inputs
  if (!database || !username) {
    throw new Error("Database name and username are required");
  }

  // Ensure password is a string (can be empty string, but not undefined/null)
  const dbPassword = password || "";

  sequelize = new Sequelize(database, username, dbPassword, {
    host: process.env.DB_HOST || "database",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false, // Set to console.log for debugging
  });

  try {
    await sequelize.authenticate();
    console.log(`✅ Database connection established: ${database}`);

    User = await createUserModel(sequelize);
    RenterProfile = await createRenterProfileModel(sequelize);

    User.hasOne(RenterProfile, {
      foreignKey: "id",
      as: "renter_profile",
    });

    RenterProfile.belongsTo(User, {
      foreignKey: "id",
      as: "user",
    });

    // Association để lấy thông tin staff xác thực KYC
    RenterProfile.belongsTo(User, {
      foreignKey: "verified_by_staff_id",
      as: "verified_by_staff",
    });

    await sequelize.sync();
    console.log(`✅ Database models synced: ${sequelize.config.database}`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    throw error; // Re-throw to let caller handle it
  }
};

export { User, RenterProfile, sequelize };
