import { Sequelize } from "sequelize";
import createUserModel from "../models/User.js";
let User = null;

export const connectDB = async (database, username, password) => {
  const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
  });
  try {
    await sequelize.authenticate();
    User = await createUserModel(sequelize);
    await sequelize.sync();
    console.log(`Connected to database: ${sequelize.config.database}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User };
