import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../libs/db.js";

const ACCESS_TOKEN_TTL = "1d";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14d

const generateAccessToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.AUTH_ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
    }
  );
  return token;
};

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json("Token not provided");
  }
  jwt.verify(
    token,
    process.env.AUTH_ACCESS_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        return res.status(403).json("Token expired");
      }
      next();
    }
  );
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.AUTH_REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_TTL,
    }
  );
  return token;
};

const registerUser = async ({
  email,
  phone_number,
  password,
  role = "renter",
  station_id = null,
}) => {
  if (!email || !phone_number || !password) {
    throw {
      statusCode: 400,
      message: "Thiếu thông tin bắt buộc: email, số điện thoại hoặc mật khẩu",
    };
  }

  const existingEmail = await User.findOne({ where: { email } });
  const existingPhone = await User.findOne({ where: { phone_number } });

  if (existingEmail || existingPhone) {
    throw { statusCode: 409, message: "Email hoặc số điện thoại đã tồn tại" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const userData = {
    email,
    phone_number,
    password_hash: hashPassword,
    role,
  };

  // Only add station_id if provided and role is staff
  if (station_id && role === "staff") {
    userData.station_id = station_id;
  }

  const user = await User.create(userData);

  return user;
};

export {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  registerUser,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
};
