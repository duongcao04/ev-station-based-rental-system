import { Sequelize } from "sequelize";
import createUserModel from "../models/User.js";
import createRenterProfileModel from "../models/RenterProfile.js";
let User = null;
let RenterProfile = null;
let sequelize;

export const connectDB = async (database, username, password) => {
  sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
  });
  try {
    await sequelize.authenticate();
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

    await sequelize.sync();
    console.log(`Connected to database: ${sequelize.config.database}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User, RenterProfile, sequelize };
