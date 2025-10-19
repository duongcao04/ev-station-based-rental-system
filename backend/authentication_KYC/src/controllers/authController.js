import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../libs/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_TTL,
} from "../services/auth.js";

export const register = async (req, res) => {
  try {
    const { email, phone_number, password } = req.body;

    if (!email || !phone_number || !password) {
      return res
        .status(400)
        .json({ message: "Email, phone number, and password are required." });
    }

    //check if user exists
    const EmailExists = await User.findOne({ where: { email: email } });
    const PhoneNBExists = await User.findOne({
      where: { phone_number: phone_number },
    });

    if (EmailExists != null || PhoneNBExists != null) {
      return res
        .status(409)
        .json({ message: "email or phone number is already exists" });
    } else {
      //hash password
      const hashPassword = await bcrypt.hash(password, 10); //salt = 10

      //create new user
      const user = await User.create({
        email,
        phone_number,
        password_hash: hashPassword,
      });

      //return
      return res.status(201).json({
        message: "User registered successfully",
        userData: {
          email,
          phone_number,
        },
      });
    }
  } catch (error) {
    console.error("Error when calling register");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    //get inputs
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const exist = await User.findOne({ where: { email: email } });
    if (exist != null) {
      //get hashedPassword in db to compare with password input
      const isValid = await bcrypt.compare(password, exist.password_hash);

      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Email or password is incorrect." });
      }

      //create accessToken with jwt
      const accessToken = await generateAccessToken(exist.dataValues);

      //create refresh token
      const refreshToken = await generateRefreshToken(exist.dataValues);
      //send refresh token in db
      await exist.update({ refreshtoken: refreshToken });

      //send refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: REFRESH_TOKEN_TTL,
      });

      //send access token in res
      return res.status(200).json({
        message: "Login successful",
        userData: {
          email: exist.dataValues.email,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } else {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }
  } catch (error) {
    console.error("Error when calling register");
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
};

export const logout = async (req, res) => {
  //get refresh token from cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: "token is empty" });
  }
  //delete refresh token in db
  const user = await User.findOne({ where: { refreshtoken: refreshToken } });
  if (user != null) {
    user.update({ refreshtoken: null });
  }

  //delete cookie
  res.clearCookie("refreshToken");
  return res.status(204).json({ message: "logout successful" });
};
